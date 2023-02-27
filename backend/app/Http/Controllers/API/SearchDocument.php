<?php

namespace App\Http\Controllers\API;

use App\Models\Guest;
use App\Models\Visits;
use App\Models\Documents;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\MailController;

class SearchDocument extends Controller
{
    public function Search(Request $request){  
        $dummy = DB::table('tbl_docu')
                ->selectRaw('title,keywords,description,Year_Published,uniq_key, count(Year_Published) as totalyear')
                    ->where('is_active_docu',1)->whereIn('Year_Published',$request->year)
                        ->where(function ($query) use ($request){
                            $query->where('title','like',"%$request->keyword%")
                                ->orWhere('keywords','like',"%$request->keyword%");
        })->groupBy('Year_Published','title')
        ->get();  

        return response()->json([
            "status"=>200,
            "ResultsOutput"=>$dummy,
        ]);
    }

    public function MostRecentFiles(Request $request){
       $recent =  DB::table('tbl_docu')
        ->selectRaw('title,keywords,description,Year_Published,uniq_key, count(Year_Published) as totalyear')
            ->where('is_active_docu',1)
                ->where(function ($query) use ($request){
                    $query->where('title','like',"%$request->keyword%")
                        ->orWhere('keywords','like',"%$request->keyword%");
        })->orderBy('Year_Published','DESC')->groupBy('Year_Published')
        ->get();  

        return response()->json([
            "status"=>200,
            "ResultsOutput"=>$recent,
        ]);
    }

    public function SearchEngine(Request $request){

        $searchkey = $request->fulltext;
    
        $output = Documents::where('is_active_docu','!=',2)
            ->where(function($query) use ($request){
                $query->where('title','like',"%$request->fulltext%")
                    ->orWhere('keywords','like',"%$request->fulltext%");
        })->orderBy('title','ASC')
        ->get();

        $yeardetails = DB::table('tbl_docu')
        ->selectRaw('Year_Published, count(Year_Published) as total')
            ->where('is_active_docu',1)
                ->where(function ($query) use ($request){
                    $query->where('title','like',"%$request->fulltext%")
                        ->orWhere('keywords','like',"%$request->fulltext%");
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
                "error"=> $request->search." "."Does Not Exist",
            ]);
        }
    }

    public function SearchResults($id){
        $output = Documents::where('is_active_docu','!=',2)
            ->where(function($query) use ($id){
                $query->where('title','like',"%$id%")
                    ->orWhere('keywords','like',"%$id%");
        })->orderBy('title','DESC')
        ->get();

        $yeardetails = DB::table('tbl_docu')
        ->selectRaw('Year_Published, count(Year_Published) as total')
            ->where('is_active_docu',1)
                ->where(function ($query) use ($id){
                    $query->where('title','like',"%$id%")
                        ->orWhere('keywords','like',"%$id%");
                })->groupBy('Year_Published')->orderBy('Year_Published','DESC')->get();   

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

    public function IpAddressregister(){
        
    }

    public function DocumentInfo($id){
        $docs = Documents::select('*')->where('uniq_key',$id)->first();
        // $author = DB::table('tbl_authors')->join('users','users.id','=','tbl_authors.author_user_fk')->selectRaw('users.name,users.email')->where('tbl_authors.document_fk',$docs->id)->groupBy('tbl_authors.author_user_fk')->get();
        $course = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')->join('tbl_course','tbl_course.id','=','tbl_info.course_fk')->selectRaw('tbl_department.department,tbl_course.course,tbl_info.file')->where('tbl_info.docu_fk',$docs->id)->first();
        $document = DB::table('tbl_docu')->join('tbl_info','tbl_info.docu_fk','=','tbl_docu.id')->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.reference_code,tbl_docu.description,tbl_docu.uniq_key,tbl_docu.optional_email,tbl_info.publication,tbl_info.file,tbl_docu.created_at,tbl_docu.Year_Published')->where('tbl_docu.uniq_key',$id)->first();

        $author = DB::table('users')
            ->join('tbl_authors','tbl_authors.author_user_fk','=','users.id')
            ->selectRaw('users.first_name,users.middle_name,users.last_name')
            ->where('tbl_authors.document_fk',$docs->id)
            ->get();

        $visitcount = Visits::where('document_code',$id)
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

    public function Visitschart($id){
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

    public function NameDocument($id){
        $data = DB::table('tbl_docu')->selectRaw('title')
        ->where('uniq_key',$id)
        ->first();

        return response()->json([
            "status"=>200,
            "data"=>$data,
        ]);
    }

    public function RegisterForm(Request $request){

        $data = DB::table('tbl_docu')->selectRaw('title')
        ->where('uniq_key',$request->code)
        ->first();

        $validate = Validator::make($request->all(),[
            "fullname"=> "required",
            "email" => "required|email",
            // "address" => "required",
            // "school" => "required",
            "message" => "required",
        ]);

        if($validate->fails()) {
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{
            $guest = new Guest;
            $num = rand(111,999);
            $num1 = rand(111,999);
            $num2 = rand(111,999);

            

            $bookid = $num."-".$num1."-".$num2;
            $guest->bookid = $bookid;
            $guest->fullname = $request->fullname;
            $guest->email = $request->email;
            $guest->address = $request->address;
            $guest->school = ($request->userole === 1) ? $request->school : "Father Saturnino Urios University";
            $guest->message = $request->message;
            $guest->department = $request->department;
            $guest->course = $request->course;
            $guest->status = 0;
            $guest->role = ($request->userole === 1) ? 1 : 2;
            $guest->document_code = $request->code;
            $guest->save();

            $mail = MailController::BookNumberNotification($bookid,$request->email,$data->title,$request->fullname,$guest->school);

            if($mail == 0){
                return response()->json([
                    "status"=>200,
                    "message"=>"Booking Form Sent",
                ]);
            }
        }
    }

}
