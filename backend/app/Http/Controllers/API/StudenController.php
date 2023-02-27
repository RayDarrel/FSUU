<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Course;
use App\Models\Visits;
use App\Models\Authors;
use App\Models\Message;
use App\Models\Favorite;
use App\Models\Documents;
use App\Models\AccessLink;
use App\Models\TblRequest;
use App\Models\VisitCount;
use App\Models\ActivityLogs;
use App\Models\DownloadsPDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class StudenController extends Controller
{
    public function Search($id){

        $user = User::find($id);

        if($user){
            return response()->json([
                "status"=>200,
                "Data"=>$user,
            ]);
        }
        else{
            return response()->json([
                "status"=>404,
                "error"=> "Data Not Found",
            ]);
        }
    }


    public function searchCode(Request $request){

        $id = $request->fsuu_code;
        // $document = Documents::select('*')->where('reference_code',$id)->first();

        // if($document){

        //     $logs = new ActivityLogs;

        //     $logs->activity = "Searhing "."".$id;
        //     $logs->user_fk = $request->id;

        //     $logs->save();

        //     return response()->json([
        //         "status"=>200,
        //         "document"=>$document,
        //     ]);
        // }
        // else{
        //     return response()->json([
        //         "status"=>404,
        //         "error"=>$id.' '."Does Not Exist",
        //     ]);
        // }

        $docs = Documents::select('*')->where('reference_code',$id)->first();

        if($docs){
            if($docs->is_active_docu == 1){
                $author = DB::table('tbl_authors')->join('users','users.id','=','tbl_authors.author_user_fk')->selectRaw('users.name,users.email')->where('tbl_authors.document_fk',$docs->id)->groupBy('tbl_authors.author_user_fk')->get();
                $course = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')->join('tbl_course','tbl_course.id','=','tbl_info.course_fk')->selectRaw('tbl_department.department,tbl_course.course,tbl_info.file')->where('tbl_info.docu_fk',$docs->id)->get();
                $document = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.reference_code,tbl_docu.description,tbl_docu.uniq_key,tbl_docu.optional_email,tbl_info.publication,tbl_info.file,tbl_docu.created_at')->where('tbl_docu.reference_code',$docs->reference_code)->first();
                if($author->count() > 0 && $course->count() > 0){
                    return response()->json([
                        "status"=>200,
                        "data"=>$docs,
                        "course"=>$course,
                        "author"=>$author,
                    ]);
                }
                else{
                    return response()->json([
                        "status"=>504,
                    ]);
                }
            }
            else{
                return response()->json([
                    "status"=>505,
                    "error"=> "This Document is Private",
                ]);
            }
        }
        else{
            return response()->json([
                "status"=>505,
                "error"=> "BarCode Does Not Exist",
            ]);
        }
        
    }

    public function Checking($id){
        // $id = $request->fsuu_code;
        $docs = Documents::select('*')->where('reference_code',$id)->first();

        if($docs->is_active_docu == 1){
            $author = DB::table('tbl_authors')->join('users','users.id','=','tbl_authors.author_user_fk')->selectRaw('users.name,users.email')->where('tbl_authors.document_fk',$docs->id)->groupBy('tbl_authors.author_user_fk')->get();
            $course = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')->join('tbl_course','tbl_course.id','=','tbl_info.course_fk')->selectRaw('tbl_department.department,tbl_course.course,tbl_info.file')->where('tbl_info.docu_fk',$docs->id)->get();
            $document = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.reference_code,tbl_docu.description,tbl_docu.uniq_key,tbl_docu.optional_email,tbl_info.publication,tbl_info.file,tbl_docu.created_at')->where('tbl_docu.reference_code',$docs->reference_code)->first();
            if($author->count() > 0 && $course->count() > 0){
                return response()->json([
                    "status"=>200,
                    "data"=>$docs,
                    "course"=>$course,
                    "author"=>$author,
                ]);
            }
            else{
                return response()->json([
                    "status"=>504,
                ]);
            }
        }
        else{
            return response()->json([
                "status"=>505,
                "error"=> "This Document is Private",
            ]);
        }
    }

    public function Favorite($id){

        $favorite = Favorite::select('*')->where('user_fk',$id)->get();

        return response()->json([
            "status"=>200,
            "Data"=>$favorite,
        ]);
    }

    public function Logs($id){
        $logs = ActivityLogs::select('*')->where('user_fk',$id)->orderBy('created_at','DESC')->get();

        return response()->json([
            "status"=>200,
            "AccountLogs"=> $logs,
        ]);
    }

    public function Remove($id){

        $favorite = Favorite::select('*')->whereIn('id',explode(",",$id));

        if($favorite){
            $favorite->delete();

            return response()->json([
                "status"=>200,
                "success"=> "Removing Favorite Archives Successfully",
            ]);
        }
        else{
            return response()->json([
                "error"=> "Data Does Not Exist",
            ]);
        }
    }

    public function AddFavorite(Request $request){

        $favorite = new Favorite;
        $favorite->status = 1;
        $favorite->user_fk = $request->id;
        $favorite->document_fk = $request->btn;

        $favorite->save();

        $document = Documents::find($request->btn);

        $logs = new ActivityLogs;
        $logs->activity = "Added Favorite"." ".$document->reference_code;
        $logs->user_fk = $request->id;

        $logs->save();

        return response()->json([
            "status"=>200,
            "success"=>"Favorite Added",
        ]);
    }

    public function GetStatus($id){

        $favorite = Favorite::select('*')->where('user_fk',$id)->first();

        return response()->json([
            "status"=>200,
            "Data"=>$favorite,
        ]);
    }

    public function RemoveItem(Request $request){

        $favorite = Favorite::select('*')->where('document_fk',$request->btn)->first();

        if($favorite){

            $favorite->delete();

            return response()->json([
                "status"=>200,
                "success"=> "Removed Favorite",
            ]);
        }
    }

    public function download(Request $request){

        $document = Documents::find($request->btn);
        $pdf = new DownloadsPDF;

        $pdf->title = $document->title;
        $pdf->reference_code = $document->reference_code;
        $pdf->size = "1000";
        $pdf->info_fk = $request->btn;
        $pdf->user_fk = $request->id;

        $pdf->save();

        return response()->json([
            "status" =>200,
            "Data"=>"Successfully Downloaded"." ".$document->title,
        ]);
    }
    public function FetchDownloads($id){

        $pdf = DownloadsPDF::select('*')->where('user_fk',$id)->get();

        return response()->json([
            "status"=>200,
            "Download"=>$pdf,
        ]);
    }

    public function ComposeSent(Request $request){

        $validate = Validator::make($request->all(),[
            "Email" =>"required|email",
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{
            $user = User::select('id')->where('email',$request->Email)->first();

        if($user){
            $message = new Message;

            $uniq = sha1(time());

            $message->message_id = $uniq;
            $message->message_text = $request->text;
            $message->subject = $request->subject;
            $message->ToUser = $user->id;
            $message->FromUser = $request->FromUser;

            if($request->hasFile('file')){
                $file = $request->file('file');
                $extension = $file->getClientOriginalExtension();
                $filename = time().".".$extension;
                $file->move('Uploads/Attachement/',$filename);
                $message->file = "Uploads/Attachement/".$filename;
            }   

            $message->save();
            return response()->json([
                "id"=>$user->id,
                "status"=>200,
                "success"=> "Composed Sent",
            ]);

        }
            else{
                return response()->json([
                    "status"=>504,
                    "email"=> "Email User Does Not Exist",
                ]);
            }
        }
    }
    public function fetchMessage($id){
        $message = Message::with('usersinfo')->select('*')->where('FromUser',$id)->orderBy('created_at','DESC')->get();

        return response()->json([
            "status"=>200,
            "Sent"=>$message,
        ]);
    }

    public function SentItemsData($id){
        $message = Message::with('usersinfo')->select('*')->where('id',$id)->get();
        return response()->json([
            "status"=>200,
            "SentData"=>$message,
        ]);
    }

    public function StudentInbox($id){
        $message = Message::with('usersinfo')->with('frominfo')->select('*')->where('ToUser',$id)->orderBy('created_at','DESC')->get();
        return response()->json([
            "status"=>200,
            "StudentInbox"=>$message,
        ]);
    }
    
    public function StudentSeen($id){
        $message = Message::find($id);

        if($message){
            $message->seen = 1;
            $message->update();

            return response()->json([
                "status"=>200,
            ]);
        }
    }

    public function StudentReadInbox($id){
        $message = Message::with('frominfo')->select('*')->where('id',$id)->get();

        if($message){
            return response()->json([
                "status"=>200,
                "Inbox"=>$message,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=> "Message not Found",
            ]);
        }
    }

    public function studentCourse(){
        $course = Course::all();
        return response()->json([
            "status"=>200,
            "Data"=>$course,
        ]);
    }
    public function studentDepartment(){
        $department = DB::table('tbl_department')->leftjoin('tbl_course','tbl_course.deparment_fk','=','tbl_department.id')->selectRaw('tbl_department.department,tbl_department.department_code,tbl_department.id, count(tbl_course.deparment_fk) as total')->groupBy('tbl_department.id')->get();
        return response()->json([
            "status"=>200,
            "department"=>$department,
        ]);
    }

    public function sendrequest(Request $request){

        $document = Documents::select('*')->where('uniq_key',$request->documentID)->first();

        $code = rand(111,999);
        $code1 = rand(111,999);
        $year = date('Y');
        $conca = "BOOKING"."-".$code."".$code1."-".$year;

        $send_request = new TblRequest;
        $send_request->subject = $request->subject;
        $send_request->name = $request->name;
        $send_request->email = $request->email;
        $send_request->purpose = $request->purpose;
        $send_request->status = 0;
        $send_request->bookid = $conca;
        $send_request->request_user_fk = $request->id;
        $send_request->request_document_fk = $document->id;
        $send_request->save();

        $access = new AccessLink;
        $access->title = $request->document_title;
        $access->document_link_fk = $document->id;
        $access->from_user_fk = $request->id;
        $access->request_fk = $send_request->id;
        $access->save();

        return response()->json([
            "status"=>200,
            "message"=>"Your Request Form has been sent",
        ]);
        }
    

    public function requestStatus($id){
        // $data = TblRequest::select('*')->where('request_user_fk',$id)->get();
        $data = DB::table('tbl_request')->join('tbl_docu','tbl_request.request_document_fk','=','tbl_docu.id')->join('tbl__access_link','tbl__access_link.request_fk','=','tbl_request.id')->where('request_user_fk',$id)->get();
        
        if($data){
            return response()->json([
                "status"=>200,
                "Data"=>$data,
            ]);
        }
    }
    public function getDocuemntDetails($id){

        $document = Documents::select('*')->where('reference_code',$id)->first();

        if($document){
            return response()->json([
                "status"=>200,
                "Data"=>$document,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=> "Data Does Not Exist",
            ]);
        }
    }

    public function KeyAccess($id){

        $document = DB::table('tbl__access_link')->join('tbl_docu','tbl__access_link.document_link_fk','=','tbl_docu.id')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')->where('tbl__access_link.link',$id)->first();

        return response()->json([
            "status"=>200,
            "information"=>$document,
        ]);

    }

    public function identification($id){

        $authors = Authors::select('author')->where('document_fk',$id)->first();

        return response()->json([
            "status"=>200,
            "Data"=>$authors,
        ]);
    }
    //search engine//
    public function SearchEngine(Request $request){

        $logs = new ActivityLogs;

        $logs->activity = "Search"." ".$request->search." "."Using SearchEngine";
        $logs->user_fk = $request->user_id;
        $logs->save();

        $output = Documents::where('is_active_docu',1)
        ->where(function($query) use ($request){
            $query->where('title','like',"%$request->search%")
            ->orWhere('keywords','like',"%$request->search%");
        })->orderBy('title','ASC')->groupBy('Year_Published')->get();

        // $output = DB::table('tbl_docu')
        // ->selectRaw('title,keywords,description,Year_Published,uniq_key')
        //     ->where('is_active_docu','!=',2)
        //         ->orWhere(function ($query){
        //             $query->where('title','like',"%$request->search%")
        //                 ->where('keywords','like',"%$request->search%")
        //         })

        if($output->count() > 0){
            return response()->json([
                "status" =>200,
                "ResultsOutput"=>$output,
            ]);
        }
        else{
            return response()->json([
                "status"=>404,
                "error"=> $request->search." "."Does Not Exist",
            ]);
        }
    }


    public function SearchEngineResult($id){


        $output = Documents::where('is_active_docu','!=',2)
            ->where(function($query) use ($id){
                $query->where('title','like',"%$id%")
                    ->orWhere('keywords','like',"%$id%");
        })->orderBy('title','DESC')->get();

        $yeardetails = DB::table('tbl_docu')
        ->selectRaw('Year_Published, count(Year_Published) as total')
            ->where('is_active_docu',1)
                ->where(function ($query) use ($id){
                    $query->where('title','like',"%$id%")
                        ->orWhere('keywords','like',"%$id%");
                })->orderBy('Year_Published','DESC')->groupBy('Year_Published')->get();   

        if($output->count() > 0){
            return response()->json([
                "status" =>200,
                "ResultsOutput"=>$output,
                // "dummy"=> $dummy,
                "Total"=>$yeardetails,
            ]);
        }
        else{
            return response()->json([
                "status"=>404,
                "error"=> "Result's Not Found",
                "Total"=>0,
            ]);
        }
    }

    public function AbstractDocument($id){
        $document = DB::table('tbl_docu')->join('tbl_info','tbl_docu.id','=','tbl_info.docu_fk')->join('tbl_authors','tbl_authors.document_fk','=','tbl_docu.id')->where('tbl_docu.id',$id)->first();
        $author = Authors::with('useraccount')->select('*')->where('document_fk',$document->id)->get();

        return response()->json([
            "status"=>200,
            "author"=>$author,
            "Data"=>$document,
        ]);
    }

    public function SearchEngineAuthor(Request $request){


        $id = $request->user_fk;

        // $author = User::find($id);

        $account = User::select('*')->whereIn('id',$id)->get();

        return response()->json([
            "status"=>200,
            "DocumentDetails"=>$account,
        ]);
    }

    public function ThesisDocument($id){
        $author = Authors::select('*')->where('author_user_fk',$id)->first();

        // $document = Documents::select('*')->where('id',$author->document_fk)->groupBy('author_user_fk')->get();

        $document = DB::table('tbl_docu')->join('tbl_authors','tbl_authors.document_fk','=','tbl_docu.id')->selectRaw('tbl_docu.id,tbl_docu.title,tbl_docu.reference_code,tbl_docu.keywords')->where('tbl_authors.author_user_fk',$id)->groupBy('tbl_authors.document_fk')->get();

        if($document->count() > 0){
            return response()->json([
                "status"=>200,
                "Details"=>$document,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=>"No Data To Display",
            ]);
        }
    }
    public function DocumentThesis($id){
        $document = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.reference_code,tbl_docu.description,tbl_docu.uniq_key,tbl_docu.optional_email,tbl_info.publication,tbl_info.file')->where('tbl_docu.id',$id)->first();

        return response()->json([
            "status"=>200,
            "data"=>$document,
        ]);
    }

    public function DocumentData(Request $request){

        $docs = Documents::select('*')->where('uniq_key',$request->document_code)->first();
        // $author = DB::table('tbl_authors')->join('users','users.id','=','tbl_authors.author_user_fk')->selectRaw('users.name,users.email')->where('tbl_authors.document_fk',$docs->id)->groupBy('tbl_authors.author_user_fk')->get();
        $course = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')->join('tbl_course','tbl_course.id','=','tbl_info.course_fk')->selectRaw('tbl_department.department,tbl_course.course,tbl_info.file')->where('tbl_info.docu_fk',$docs->id)->first();
        $document = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.reference_code,tbl_docu.description,tbl_docu.uniq_key,tbl_docu.optional_email,tbl_info.publication,tbl_info.file,tbl_docu.created_at,tbl_docu.Year_Published')->where('tbl_docu.uniq_key',$request->document_code)->first();

        $author = DB::table('users')
            ->join('tbl_authors','tbl_authors.author_user_fk','=','users.id')
            ->selectRaw('users.first_name,users.middle_name,users.last_name')
            ->where('tbl_authors.document_fk',$docs->id)
            ->get();

        $visitcount = Visits::where('document_code',$request->document_code)
        ->get();
        

        if($visitcount->count() > 0){
            return response()->json([
                "status"=>200,
                "data"=>$document,
                "author"=>$author,
                "course"=> $course,
                "visits"=> $visitcount->count(),
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "visits"=>0,
            ]);
        }
    }

    public function IpAddressAccess(Request $request){

        $ipaddress = $request->ipaddress;
        $user_fk = $request->user_fk;
        $access = $request->access;
        
        $check = Visits::where([
            ['IP',$ipaddress],
            ['document_code',$access],
        ])->first();
        

        if($check){
            $checkip = Visits::where([
                ['IP',$ipaddress],
            ])->first();

            if($checkip){
                $count = VisitCount::select('*')->where('document_access_code',$access)->first();
                return response()->json([
                    "status"=>200,
                    "count"=>$count->visit_count,
                ]);
            }
            else{
                $tblcount = VisitCount::where([
                    ['document_access_code',$access],
                ])->first();
                if($tblcount){
                    $count_update = DB::table('tbl_count')->where('document_access_code',$access)->update(['visit_count'=>$tblcount->visit_count + 1]);
                   
                    $count = VisitCount::select('*')->where('document_access_code',$access)->first();
                    return response()->json([
                        "status"=>200,
                        "count"=>$count->visit_count,
                    ]);
                }
            }
        }
        else{
            $visits = new Visits;
            $visits->document_code = $access;
            $visits->IP = $ipaddress;
            $visits->user_fk = $user_fk;
            $visits->Readers = "Student";
            $visits->save();  

            $tbladd = new VisitCount;
            $tbladd->document_access_code = $access;
            $tbladd->visit_count = 1;
            $tbladd->save();
        }   
    }

    public function Visitors($id){
        // $total = DB::table('tbl_visits')->selectRaw('count(created_at) as total,'..'')->where('document_code',$id)->where('created_at','>=',date('Y-m-d').'00:00:00')->groupBy('created_at')->get();
        $total  = DB::table('tbl_visits')->select(DB::raw('DATE (created_at) as date'),DB::raw('count(*) as views'))->where('document_code',$id)->groupBy('date')->get();
        if($total->count() > 0){
            return response()->json([
                "status"=>200,
                "data"=>$total,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "data"=>"No Data To Display",
            ]);
        }
    }

    public function AccessLink($id){

        $records = DB::table('tbl__access_link')->join('tbl_docu','tbl__access_link.document_link_fk','=','tbl_docu.id')
        ->selectRaw('tbl_docu.title,tbl_docu.uniq_key,tbl_docu.reference_code,tbl__access_link.created_at,tbl__access_link.access_key,tbl__access_link.id')
        ->where('tbl__access_link.request_fk',$id)
        ->get();

        if($records->count() > 0){
            return response()->json([
                "status"=>200,
                "record"=> $records,
            ]);
        }   
        else{
            return response()->json([
                "status"=>504,
                "record"=> "No Data",
            ]);
        }
    }

    public function AccessChecking($id){
        $docs = Documents::where('uniq_key',$id)->first();

        $author = DB::table('tbl_authors')->join('users','users.id','=','tbl_authors.author_user_fk')
        ->selectRaw('users.name,users.email')->where('tbl_authors.document_fk',$docs->id)
        ->groupBy('tbl_authors.author_user_fk')
        ->get();

        $course = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')
        ->join('tbl_course','tbl_course.id','=','tbl_info.course_fk')
        ->selectRaw('tbl_department.department,tbl_course.course,tbl_info.file')
        ->where('tbl_info.docu_fk',$docs->id)
        ->get();

        $document = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')
        ->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.reference_code,tbl_docu.description,tbl_docu.uniq_key,tbl_docu.optional_email,tbl_info.publication,tbl_info.file,tbl_docu.created_at')
        ->where('tbl_docu.reference_code',$docs->reference_code)
        ->first();
            if($author->count() > 0 && $course->count() > 0){
                return response()->json([
                    "status"=>200,
                    "data"=>$docs,
                    "course"=>$course,
                    "author"=>$author,
                ]);
            }
            else{
                return response()->json([
                    "status"=>504,
                ]);
            }
    }

    public function DocumentDetails($id){


    }
    
}
