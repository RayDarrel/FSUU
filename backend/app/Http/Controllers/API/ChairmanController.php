<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Message;
use App\Models\Documents;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class ChairmanController extends Controller
{
    public function SearchEngineStaff(Request $request){
        $output = Documents::where('is_active_docu','!=',2)
            ->where(function($query) use ($request){
                $query->where('title','like',"%$request->search%")
                    ->orWhere('keywords','like',"%$request->search%");
        })->get();

        if($output->count() > 0){
            return response()->json([
                "status" =>200,
                "ResultsOutput"=>$output,
            ]);
        }
        else{
            return response()->json([
                "status"=>404,
                "error"=> "Result's Not Found",
            ]);
        }
    }
    public function Archives(){
        $docu = Documents::select('*')->orderBy('created_at','ASC')->get();

        return response()->json([
            "status"=> 200,
            "data"=>$docu,
        ]);
    }

    public function SearchEngineResults($id){
        $output = Documents::where('is_active_docu','!=',2)
            ->where(function($query) use ($id){
                $query->where('title','like',"%$id%")
                    ->orWhere('keywords','like',"%$id%");
        })->get();

        if($output->count() > 0){
            return response()->json([
                "status" =>200,
                "ResultsOutput"=>$output,
            ]);
        }
        else{
            return response()->json([
                "status"=>404,
                "error"=> "Result's Not Found",
            ]);
        }
    }
    public function DocumentData($id){

        $docs = Documents::select('*')->where('uniq_key',$id)->first();
        $author = DB::table('tbl_authors')->join('users','users.id','=','tbl_authors.author_user_fk')->selectRaw('users.name,users.email')->where('tbl_authors.document_fk',$docs->id)->groupBy('tbl_authors.author_user_fk')->get();
        $course = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')->join('tbl_course','tbl_course.id','=','tbl_info.course_fk')->selectRaw('tbl_department.department,tbl_course.course,tbl_info.file')->where('tbl_info.docu_fk',$docs->id)->get();
        $document = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.reference_code,tbl_docu.description,tbl_docu.uniq_key,tbl_docu.optional_email,tbl_info.publication,tbl_info.file,tbl_docu.created_at')->where('tbl_docu.uniq_key',$id)->first();

        if($author->count() > 0 && $course->count() > 0){
            return response()->json([
                "status"=>200,
                "data"=>$document,
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

    public function SchoolYear(){
        // $year = Year::select('*')->orderBy('id','DESC')->get();
        $count = DB::table('tbl_school_year')->leftjoin('users', 'users.school_year_fk','=','tbl_school_year.id')->selectRaw('tbl_school_year.school_year,count(users.id) as total,tbl_school_year.id')->orderBy('tbl_school_year.id','DESC')->groupBy('tbl_school_year.school_year')->get();
        $thesis = DB::table('tbl_info')->leftjoin('tbl_school_year','tbl_info.year_fk','=','tbl_school_year.id')->selectRaw('count(tbl_info.year_fk) as total_thesis')->groupBy('tbl_school_year.school_year')->get();
        return response()->json([
            "status"=>200,
            "Year"=>$count,
            "Thesis"=>$thesis,
        ]);
    }
    
    public function AllAccountsSchoolYear(){
        $count = DB::table('users')->join('tbl_department','users.department_fk','=','tbl_department.id')->selectRaw('tbl_department.department_code, count(users.department_fk) as total,tbl_department.color_code as color')
        ->whereIn('users.role',[2,3,4,5,6])
        ->groupBy('users.department_fk')
        ->get();

        if($count->count() > 0){
            return response()->json([
                "status"=>200,
                "details"=>$count,
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "details"=>"No Data",
            ]);
        }
    }

    public function AllAnalyticsDocuments(){
        $count = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')
        ->selectRaw('tbl_department.department,tbl_department.department_code,tbl_department.color_code ,count(tbl_info.department_fk) as totaldocuments')
        ->groupBy('tbl_info.department_fk')->get();

        if($count->count() > 0){
            return response()->json([
                "status"=>200,
                "DocumentsTotal"=>$count,
          
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "DocumentsTotal"=>"No Data",
            ]);
        }
    }

    public function RatedDocument(){
        // $visits = VisitCount::select('*')->orderBy('visit_count','DESC')->limit(3)->get();
        // $visits = DB::table('tbl_count')->join('tbl_docu','tbl_count.document_access_code','=','tbl_docu.uniq_key')->selectRaw('tbl_count.visit_count,tbl_docu.title')->orderBy('visit_count','DESC')->limit(3)->get();

        $visits = DB::table('tbl_visits')->join('tbl_docu','tbl_visits.document_code','=','tbl_docu.uniq_key')
            ->selectRaw('count(tbl_visits.document_code) as total, tbl_docu.title as name')
            ->orderBy('total','DESC')->groupBy('tbl_visits.document_code')->limit(5)
            ->get();

        if($visits->count() > 0){
            return response()->json([
                "status"=>200,
                "count"=>$visits,
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "error"=>"No Data To Display",
            ]);
        }
    }
    public function SendMessage(Request $request){

        $user = User::where('email',$request->user)->first();

        if($user){
            $msg = new Message;

            $uniq = sha1(time());

            $msg->message_id = $uniq;
            $msg->message_text = $request->msg;
            $msg->subject = $request->subject;
            $msg->ToUser = $user->id;
            $msg->FromUser = $request->from;

            $msg->save();

            return response()->json([
                "status"=>200,
                "success"=> "Compose Sent",
            ]);
            
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=> "Email Does Not Exist",
            ]);
        }
    }

    public function Inbox($id){
        $inbox = DB::table('tbl_msg')->join('users','users.id','=','tbl_msg.ToUser')
        ->selectRaw('tbl_msg.message_id,tbl_msg.subject,users.email,tbl_msg.seen,tbl_msg.created_at')
        ->where('tbl_msg.ToUser',$id)->orderBy('tbl_msg.created_at','DESC')
        ->get();

        if($inbox->count() >0){
            return response()->json([
                "status"=>200,
                "inbox"=>$inbox,
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "inbox"=>"No Data To Display",
            ]);
        }
    }

    public function MessageItem($id){
        $message = Message::with('usersinfo')->select('*')->where('FromUser',$id)->orderBy('created_at','DESC')->get();

        return response()->json([
            "status"=>200,
            "Sent"=>$message,
        ]);
    }
    public function document($id){
        // eloquent
        $document =  Documents::with('information')->with('authors')->where('id',$id)->get();
        $course = DB::table('tbl_info')->join('tbl_department', 'tbl_info.department_fk','=','tbl_department.id')->join('tbl_course','tbl_course.deparment_fk','=','tbl_department.id')->selectRaw('tbl_department.department as dept,tbl_course.course as cours')->where('tbl_info.docu_fk',$id)->groupBy('tbl_info.department_fk')->get();

        return response()->json([
            "status"=>200,
            "document"=>$document,
            "course"=>$course,
        ]);
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
            $visits->save();  

            $tbladd = new VisitCount;
            $tbladd->document_access_code = $access;
            $tbladd->visit_count = 1;
            $tbladd->save();
        }   
    }
}
