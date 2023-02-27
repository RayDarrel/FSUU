<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Message;
use App\Models\Documents;
use App\Models\AccessLink;
use App\Models\TblRequest;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LibraryController extends Controller
{
    public function Compose(Request $request){
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

    public function fetchMessageSentLibrary($id){
        $message = Message::with('usersinfo')->select('*')->where('FromUser',$id)->get();
        return response()->json([
            "status"=>200,
            "SentData"=>$message,
        ]);
    }

    public function LibraryInbox($id){
        $message = Message::with('usersinfo')->with('frominfo')->select('*')->where('ToUser',$id)->get();
        $count = $message->count();
        return response()->json([
            "status"=>200,
            "Count"=>$count,
            "LibraryInbox"=>$message,
        ]);
    }

    public function Libraryseen($id){
        $message = Message::find($id);

        if($message){
            $message->seen = 1;
            $message->update();

            return response()->json([
                "status"=>200,
            ]);
        }
    }

    public function LibraryReadInbox($id){
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

    public function LibrarySentItemsData($id){
        $message = Message::with('usersinfo')->select('*')->where('id',$id)->get();
        return response()->json([
            "status"=>200,
            "SentData"=>$message,
        ]);
    }

    public function LibraryStudent(){
        $account = User::select('*')->where('role',2)->get();
        return response()->json([
            "status"=>200,
            "accounts"=>$account,
        ]);
    }

    public function LinkRegister(Request $request,  $id){

        $validate = Validator::make($request->all(), [
            "title"=>"required",
            "code"=> "required",
            "link"=> "required",
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{
            $code = "FSUU-"."".$request->code;
            $document = Documents::select('*')->where('reference_code',$code)->skip(0)->take(1)->first();
            if($document){
                $access = new AccessLink;
    
                $access->document_link_fk = $document->id;
                $access->link = $request->link;
                $access->title = $document->title;
                $access->from_user_fk = 25;
                $access->user_account_fk = $id;
                $access->save();
    
                return response()->json([
                    "status"=>200,
                    "success"=> "Link Added Successfully",
                ]);
            }
            else{
                return response()->json([
                    "status"=>504,
                    "error"=> "Document Does Not Exist",
                ]);
            }
        }    
    }

    public function AccessLink($id){

        $access = AccessLink::select('*')->where('user_account_fk',$id)->get();
        $user = User::select('*')->where('id',$id)->first();

        return response()->json([
            "status"=>200,
            "Info"=>$user,
            "Access"=>$access,
        ]);
    }

    public function LinkRemove($id){

        $access = AccessLink::select('id')->whereIn('id',explode(",",$id));

        if($access){
            $access->delete();
            return response()->json([
                "status"=>200,
                "remove"=> "Successfully Removed",
            ]);
        }
        else{

        }
    }

    public function libraryArchives(){
        $docu = Documents::select('*')->orderBy('created_at','ASC')->get();

        return response()->json([
            "status"=> 200,
            "data"=>$docu,
        ]);
    }

    public function LibraryDocument($id){
        $document =  Documents::with('information')->with('authors')->where('id',$id)->get();
        $course = DB::table('tbl_info')->join('tbl_department', 'tbl_info.department_fk','=','tbl_department.id')->join('tbl_course','tbl_course.deparment_fk','=','tbl_department.id')->selectRaw('tbl_department.department,tbl_course.course')->get();

        return response()->json([
            "status"=>200,
            "document"=>$document,
            "course"=>$course,
        ]);
    }

    public function accesskey(Request $request, $id){

        $time = sha1(time());

        // $access = new AccessLink;

        // $access->title = $request->title;
        // $access->link = "http://127.0.0.1:8000/".$time;
        // $access->document_link_fk = $id;
        // $access->user_account_fk = $request->user_id;
        // $access->save();
        
        $logs = new ActivityLogs;
        $logs->activity = "Generating Access"." ".$request->title;
        $logs->user_fk = $request->user_id;
        $logs->save();
        
        return response()->json([
            "status"=>200,
            "File"=>"http://127.0.0.1:8000/".$time,
        ]);
    }
    
    public function LinkView($id){
        $data = AccessLink::select('link')->where('id',$id)->first();

        if($data){
            return response()->json([
                "status"=>200,
                "Data"=>$data,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=>"Data Does Not Exist",
            ]);
        }
    }

    public function saveAccess(Request $request, $id){

        $new = implode(',',array_filter($request->account));
        $acc = User::select('*')->whereIn('email',explode(',',$new))->pluck('id');
        $pk = $acc;

        // Inserting Multiple Data 
        foreach($pk as $key){
            $data = array(
                'title' => $request->title,
                'link' => $request->access,
                'document_link_fk' => $id,
                'user_account_fk'=> $key,
                'from_user_fk'  => $request->user_id,
                'created_at' =>  date_create(),
            );
            AccessLink::insert($data);
        }
        
        $logs = new ActivityLogs;
        $logs->activity = "Save Access Link"." ".$request->title;
        $logs->user_fk = $request->user_id;
        $logs->save();

        return response()->json([
            "status"=>200,
            "success"=>"Successfully Saved",
        ]);
    }

    public function LibraryLogs($id){

        $logs = ActivityLogs::select('*')->where('user_fk',$id)->get();

        if($logs){
            return response()->json([
                "status"=>200,
                "Data"=>$logs,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=> "Data Does Not Exist",
            ]);
        }
    }
    

    public function RequestBooking(){
        $data = DB::table('tbl_request')->join('tbl_docu','tbl_request.request_document_fk','=','tbl_docu.id')->join('users','tbl_request.request_user_fk','=','users.id')->get();

        if($data){
            return response()->json([
                "status"=>200,
                "Data"=>$data,
            ]);
        }
    }

    public function ViewBooking($id){

        $document = TblRequest::select('*')->where('bookid',$id)->first();

        $data = DB::table('tbl_request')->join('tbl_docu','tbl_request.request_document_fk','=','tbl_docu.id')->join('users','tbl_request.request_user_fk','=','users.id')->join('tbl_course','tbl_course.id','=','users.course_fk')->join('tbl_department','tbl_department.id','=','users.department_fk')->where('tbl_request.id',$document->id)->first();

        if($data){
            return response()->json([
                "status"=>200,
                "message"=>$data,
            ]);
        }
    }

    public function CreateAccess(Request $request, $id){
        $time = sha1(time());

        $logs = new ActivityLogs;
        $logs->activity = "Generating Access"." ".$request->document_code;
        $logs->user_fk = $request->user_id;
        $logs->save();
        
        return response()->json([
            "status"=>200,
            "File"=>$time,
        ]);
    }

    public function BookingSave(Request $request,$id){
        $new = implode(',',array_filter($request->account));
        $acc = User::select('*')->whereIn('email',explode(',',$new))->pluck('id');
        $document = Documents::select('*')->where('reference_code',$id)->first();
        $request_link = TblRequest::select('*')->where('bookid',$request->bookidcode)->first();
        // $pk = $acc;

        // foreach($pk as $key){
        //     $data = array(
        //         'title' => $request->document_title,
        //         'link' => $request->access,
        //         'document_link_fk' => $document->id,
        //         'user_account_fk'=> $key,
        //         'from_user_fk'  => $request->user_id,
        //         'created_at' =>  date_create(),
        //     );
        //     AccessLink::insert($data);
        // }


        $tbl = DB::table('tbl_request')->where('id',$request_link->id)->update(['status'=> 1]);

        if($tbl){
            
            $access = DB::table('tbl__access_link')->where('request_fk',$request_link->id)->update(['link'=>$request->access]);
            return response()->json([
                "status"=>200,
                "success"=>"Successfully Created",
            ]);
        }
        else{

        }
    }

    public function TotalBooking(){
        $pending = TblRequest::select('*')->where('status',0)->get();
        $approved = TblRequest::select('*')->where('status',1)->get();
        $booking = TblRequest::select('*')->get();
        if($pending->count() > 0 || $approved->count() > 0 || $booking->count() > 0){
            return response()->json([
                "status"=>200,
                "pending"=>$pending->count(),
                "approved"=>$approved->count(),
                "booking"=>$booking->count(),
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "pending"=>0,
                "approved"=>0,
                "booking"=>0,
            ]);
        }
    }

    public function Book(){
        $book = TblRequest::select('*')->get();

        if($book->count() > 0){
            return response()->json([
                "status"=>200,
                "book"=>$book,
            ]);
        }
        else{
            return response()->json([
                "text"=>"No Registered Data",
            ]);
        }
    }
}
