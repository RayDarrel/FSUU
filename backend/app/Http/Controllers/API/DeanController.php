<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Year;
use App\Models\Course;
use App\Models\Visits;
use App\Models\Message;
use App\Models\Documents;
use App\Models\Department;
use App\Models\VisitCount;
use App\Models\Information;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class DeanController extends Controller
{
    public function CountMsg($id){
        $count = Message::where('ToUser',$id)
        ->where(function ($query) use ($id){
            $query->where('seen',0);
        })
        ->get();

        if($count->count() > 0){
            return response()->json([
                "status"=>200,
                "count"=>$count->count(),
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "count"=>0,
            ]);
        }
    }

    public function SearchEngine(Request $request){

        $searchkey = $request->search;
        $logs = new ActivityLogs;

        $logs->activity = "Searching"." ".$request->search;
        $logs->user_fk = $request->user_id;
        $logs->save();

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

    public function SearchEngineResult($id){
        $output = Documents::where('is_active_docu','!=',2)
            ->where(function($query) use ($id){
                $query->where('title','like',"%$id%")
                    ->orWhere('keywords','like',"%$id%");
        })->get();
        
        $yeardetails = DB::table('tbl_docu')
        ->selectRaw('Year_Published, count(Year_Published) as total')
            ->where('is_active_docu',1)
                ->where(function ($query) use ($id){
                    $query->where('title','like',"%$id%")
                        ->orWhere('keywords','like',"%$id%");
                })->groupBy('Year_Published')->get();   

        if($output->count() > 0){
            return response()->json([
                "status" =>200,
                "ResultsOutput"=>$output,
                "Total"=>$yeardetails,
            ]);
        }
        else{
            return response()->json([
                "status"=>404,
                "error"=> "Result's Not Found",
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
            $visits->Readers = "Department Head";
            $visits->save();  

            $tbladd = new VisitCount;
            $tbladd->document_access_code = $access;
            $tbladd->visit_count = 1;
            $tbladd->save();
        }   
    }

    public function StudentDataDean($id){

        $dean = User::find($id);

        if($dean){
            $student = User::select("*")->where('role',2)
            ->where(function($query) use ($dean) {
                $query->where('department_fk',$dean->department_fk);
            })
            ->orderBy('created_at', 'DESC')->get();
            return response()->json([
                "status"=>200,
                "Data"=>$student,
            ]);
        }
    }

    public function getinfo($id){
        $info = DB::table('users')->join('tbl_department','users.department_fk','=','tbl_department.id')
            ->selectRaw('tbl_department.department,tbl_department.department_code,users.name,users.position')
                ->where('users.id',$id)->first();
                    return response()->json([
                        "status"=>200,
                        "Info"=>$info,
                    ]);
    }

    public function archivesdean($id){
        
        $users = User::find($id);

        if($users){

            $docu = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')
                ->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')
                    ->selectRaw('tbl_docu.uniq_key,tbl_docu.title,tbl_docu.reference_code,tbl_docu.created_at,tbl_docu.is_active_docu')
                        ->where('tbl_info.department_fk',$users->department_fk)
                            ->get();

            return response()->json([
                "status"=> 200,
                "data"=>$docu,
            ]);
        }
    }

    public function CourseSelected(Request $request){

        $user = User::find($request->id);

        $course = Course::select('*')->where('deparment_fk',$user->department_fk)
        ->get();

        if($course->count() > 0){
            return response()->json([
                "status"=>200,
                "data"=>$course,
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "data"=>"No Data",
            ]);
        }
    }

    public function RegisterAccount(Request $request){


        $validate = Validator::make($request->all(),[
            "email"=> "required|email|unique:users,email",
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=>$validate->messages(),
            ]);
        }
        else{
            $user = User::find($request->user);
            $year = Year::select('*')->orderBy('id','DESC')->skip(0)->take(1)->first();

            $regiser = new User;

            $regiser->idnumber = $request->idnum;
            $regiser->first_name = $request->fname;
            $regiser->middle_name = $request->mname;
            $regiser->last_name = $request->lname;
            $regiser->name = $request->idnum;
            $regiser->email = $request->email;
            $regiser->department_fk = $user->department_fk;
            $regiser->course_fk = $request->course;
            $regiser->school_year_fk = $year->id;
            $regiser->position = "Student";
            $regiser->is_active = 1;
            $regiser->role = 2;

            $regiser->save();

            $logs = new ActivityLogs;

            $logs->activity = "Registered Data"." ".$request->email;
            $logs->user_fk = $request->user;
            $logs->save();

            return response()->json([
                "status"=>200,
                "message"=> $request->email,
            ]);
        }
    }
    public function importdata(Request $request){
        $year = Year::select('*')->orderBy('id','DESC')->skip(0)->take(1)->first();
        $department = Department::select('*')->where('department',$request->department)->first();
        $course = Course::select('*')->where('course',$request->course)->first();
        
        $user = new User;
        $name = $request->first." ".$request->middle." ".$request->last;
        // $typeaccrole = 2
        $user->idnumber = $request->IDNumber; //done
        $user->first_name = $request->first;
        $user->middle_name = $request->middle;
        $user->last_name = $request->last;
        $user->name = $name; // done
        $user->email = $request->email; // done
        $user->department_fk = $department->id;
        $user->course_fk = $course->id;
        $user->position = "Student";  //done
        $user->school_year_fk = $year->id; // done
        $user->role = 2; // done
        $user->is_active = 1; // done
        $user->save();

        $logs = new ActivityLogs;
        
        $logs->activity = "Import CSV Data Files";
        $logs->user_fk = $request->user;
        $logs->save();

        return response()->json([
            "status"=>200,
            "message"=>$request->email,
        ]);
    }

    public function Dashboard(Request $request){

        $user = User::find($request->id);

        $thesis = Information::where('department_fk',$user->department_fk)->get();
        $allacount = User::where([
            ['role',2],
            ['department_fk',$user->department_fk],
        ])->get();
        $active = User::where([
            ['is_active',1],
            ['role',2],
            ['department_fk',$user->department_fk],
        ])->get();
        $not = User::where([
            ['is_active',0],
            ['role',2],
            ['department_fk',$user->department_fk],
        ])->get();


        if($thesis->count() > 0 || $allacount->count() > 0 || $active->count() > 0 || $not->count() > 0){
            return response()->json([
                "status"=>200,
                'thesis'=>$thesis->count(),
                'all'=>$allacount->count(),
                'active'=>$active->count(),
                'not'=> $not->count(),
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                'thesis'=>0,
                'all'=>0,
                'active'=>0,
                'not'=> 0,
            ]);
        }
    }

    public function BarData(Request $request){

        $user = User::find($request->id);

        $data = DB::table('tbl_docu')->leftjoin('tbl_visits','tbl_docu.uniq_key','=','tbl_visits.document_code')
            ->leftjoin('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')
            ->selectRaw('title,count(document_code) as visits')
            ->where('tbl_info.department_fk',$user->department_fk)
            ->orderBy('visits','DESC')
            ->limit(5)
            ->groupBy('tbl_visits.document_code')
            ->get();

        return response()->json([
            "status"=>200,
            "analytics"=>$data,
        ]);
    }

    public function DetailsDocu(Request $request){
        $document =  Documents::with('information')->with('authors')->where('uniq_key',$request->key)->first();
        $course = DB::table('tbl_info')->join('tbl_department', 'tbl_info.department_fk','=','tbl_department.id')->join('tbl_course','tbl_course.deparment_fk','=','tbl_department.id')->selectRaw('tbl_department.department as dept,tbl_course.course as cours')->where('tbl_info.docu_fk',$document->id)->groupBy('tbl_info.department_fk')->first();
        $author = DB::table('users')
            ->join('tbl_authors','tbl_authors.author_user_fk','=','users.id')
            ->selectRaw('users.first_name,users.middle_name,users.last_name')
            ->where('tbl_authors.document_fk',$document->id)
            ->get();

        return response()->json([
            "status"=>200,
            "document"=>$document,
            "author"=>$author,
            "course"=>$course,
        ]);
    }
    public function ActivityLogs($id){
        $logs = ActivityLogs::select('*')->where('user_fk',$id)->orderBy('created_at','DESC')->get();

        return response()->json([
            "status"=>200,
            "AccountLogs"=> $logs,
        ]);
    }

    public function SendCompose(Request $request){
        $user = User::where('email',$request->Email)->first();

        if($user){
            $msg = new Message;

            $uniq = sha1(time());

            $msg->message_id = $uniq;
            $msg->message_text = $request->text;
            $msg->subject = $request->subject;
            $msg->ToUser = $user->id;
            $msg->FromUser = $request->FromUser;
            $msg->save();

            $logs = new ActivityLogs;
        
            $logs->activity = "Compose Message And Sent it to"." ".$request->Email." "."as"." ".$user->position;
            $logs->user_fk = $request->FromUser;
            $logs->save();

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
    public function FacultyInbox($id){
        $inbox = DB::table('tbl_msg')->join('users','users.id','=','tbl_msg.ToUser')
        ->selectRaw('tbl_msg.message_id,tbl_msg.subject,users.email,tbl_msg.seen,tbl_msg.created_at')
        ->where('tbl_msg.ToUser',$id)->orderBy('tbl_msg.created_at','DESC')
        ->get();

        if($inbox->count() >0){
            return response()->json([
                "status"=>200,
                "FacultyInbox"=>$inbox,
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "inbox"=>"No Data To Display",
            ]);
        }
    }

    public function DeanReadData($id){
        $message = Message::with('frominfo')->select('*')->where('message_id',$id)->first();

        if($message){
            $message->seen = 1;
            $message->update();
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

    public function fetchMessageSentFaculty($id){
        $message = Message::with('usersinfo')->select('*')->where('FromUser',$id)->orderBy('created_at','DESC')->get();

        return response()->json([
            "status"=>200,
            "Sent"=>$message,
        ]);
    }

    public function SentItemsDataFaculty($id){
        $message = Message::with('usersinfo')->select('*')->where('message_id',$id)->first();
        return response()->json([
            "status"=>200,
            "SentData"=>$message,
        ]);
    }
}
