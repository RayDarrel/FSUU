<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Year;
use App\Models\Guest;
use App\Models\Course;
use App\Models\Visits;
use App\Models\Authors;
use App\Models\Message;
use App\Models\Documents;
use App\Models\AccessLink;
use App\Models\Department;
use App\Models\VisitCount;
use App\Models\Information;
use App\Models\ActivityLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use League\CommonMark\Node\Block\Document;
use App\Http\Controllers\API\MailController;

class AdminController extends Controller
{
    public function import_student(Request $request){

        
        $year = Year::select('*')->orderBy('id','DESC')->skip(0)->take(1)->first();
        $department = Department::select('*')->where('department',$request->department)->first();
        $course = Course::select('*')->where('course',$request->course)->first();
        
        $user = new User;
        $name = $request->first." ".$request->middle." ".$request->last;
        $typeaccrole = ($request->accounttype == 2) ? "Student" :  (($request->accounttype == 3) ? "Dean" : (($request->accounttype == 4) ? "Library" : (($request->accounttype == 5 ? "Chairman" : "Department Head"))));
        $user->idnumber = $request->IDNumber; //done
        $user->first_name = $request->first;
        $user->middle_name = $request->middle;
        $user->last_name = $request->last;
        $user->name = $name; // done
        $user->email = $request->email; // done
        $user->department_fk = $department->id;
        $user->course_fk = $course->id;
        $user->position = $typeaccrole;  //done
        $user->school_year_fk = $year->id; // done
        $user->role = $request->accounttype; // done
        $user->is_active = 1; // done
        $user->save();

        $mail = MailController::sendmail($name,$user->email,$typeaccrole);

        if($mail == 0){
            return response()->json([
                "status"=>200,
                "Info"=> $name." ".$request->IDNumber,
                "message"=>"Data Imported",
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=>"Server Error",
            ]);
        }
    }

    // Student Data
    public function StudentData(){

        $student = User::select("*")->where('role',2)->orderBy('created_at', 'DESC')->get();

        return response()->json([
            "status"=>200,
            "Data"=>$student,
        ]);
    }
    public function Search($id){
        $data = DB::table('users')->join('tbl_department','tbl_department.id','=','users.department_fk')
        ->join('tbl_course','tbl_course.id','=','users.course_fk')
        ->join('tbl_school_year','tbl_school_year.id','=','users.school_year_fk')
        ->selectRaw('users.id,users.idnumber,users.email,users.name,users.googleID,users.is_active,tbl_department.department,tbl_course.course,tbl_school_year.school_year')
        ->where('users.id',$id)
        ->first();

        if($data){
           return response()->json([
                "status"=>200,
                "Data"=>$data,
           ]); 
        }
        else{
            return response()->json([
                "error"=>"ID Does Not Exist",
            ]);
        }
    }
    public function Update(Request $request, $id){

        $validate = Validator::make($request->all(), [
            "idnumber"=> "required",
            "name"=> "required|max: 191",
            "email"=> "required|email",
            "department"=> "required",
            "course"=> "required",
            
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=>$validate->messages(),
            ]);
        }
        else{
            $user = User::find($id);

            if($user){
                if($request->status == ""){
                    $user->idnumber = $request->idnumber;
                    $user->name = $request->name;
                    $user->email = $request->email;
                    $user->save();

                    return response()->json([
                        "status"=>200,
                        "message"=>"Data Updated Successfully",
                    ]);
                }
                else{
                    $user->idnumber = $request->idnumber;
                    $user->name = $request->name;
                    $user->email = $request->email;
                    $user->is_active = $request->status;

                    $user->save();

                    return response()->json([
                        "status"=>200,
                        "message"=>"Data Updated Successfully",
                    ]);
                }
            }
            else{
                return response()->json([
                    "status"=>422,
                    "error"=> "Account Does Not Exist",
                ]);
            }
        }
    }

    public function UpdateStatusAccount(Request $request){
        $userupdate = User::find($request->user);

        if($userupdate){
            $userupdate->is_active = $request->is_active;
            $userupdate->update();

            return response()->json([
                "status"=>200,
                "message"=>"Data Updated Successfully",
            ]);
        }
    }

    public function Save(Request $request){

        $validate = Validator::make($request->all(), [
            "idnum"=> "required|max:191",
            "fname"=> "required|max:191",
            "mname"=> "required|max:191",
            "lname"=> "required|max:191",
            "email"=> "required|email|max:191|unique:users,email",
        ]);
        if($validate->fails()){
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{
            
            $typeacc = $request->accounttype;   

            $typeaccrole = ($typeacc == 2) ? "Student" :  (($typeacc == 3) ? "Dean" : (($typeacc == 4) ? "Library" : (($typeacc == 5 ? "Chairman" : "New"))));

            $user = new User;

            $name = $request->input('fname')." ".$request->input('mname')." ".$request->input('lname');

            $user->idnumber = $request->input('idnum');
            $user->first_name = $request->fname;
            $user->middle_name = $request->mname;
            $user->last_name = $request->lname;
            $user->name = $name;
            $user->email = $request->input('email');
            $user->department_fk = $request->deparment_fk;
            $user->course_fk = $request->course_fk;
            $user->position = $typeaccrole;
            $user->school_year_fk = $request->yearid;
            $user->is_active = 1;
            $user->role = $typeacc;
            $user->save();

            $logs = new ActivityLogs;

            $logs->activity = $request->input('idnum')." "."Has Been Registered";
            $logs->user_fk = $request->adminkey;

            $logs->save();

            $mail = MailController::sendmail($name,$user->email,$user->position);

            if($mail == 0){
                return response()->json([
                    "status"=>200,
                    "success"=> "Successfully Saved Data",
                ]);
            }
        }
    }

    public function delete($id){

        $user = User::select('id')->whereIn('id',explode(",",$id));

        if($user){
            $user->delete();
            return response()->json([
                "status"=>200,
                "message"=>"Deleted Data Successfully",
            ]);
        }
        else{
            return response()->json([
                "error"=> "Data Does Not Exist",
            ]);
        }
    }

    // Dean Data
    public function DeanData(){
        $dean = User::select("*")->where('role',3)->orderBy('created_at', 'DESC')->get();

        return response()->json([
            "status"=>200,
            "DataDean"=>$dean,
        ]);
    }

    

    // Library
    public function LibraryData(){
        $library = User::select("*")->where('role',4)->orderBy('created_at', 'DESC')->get();

        return response()->json([
            "status"=>200,
            "library"=>$library,
        ]);
    }

    // Chairman
    public function Chairman(){
        $chairman = User::select("*")->where('role',5)->orderBy('created_at', 'DESC')->get();

        return response()->json([
            "status"=>200,
            "chairman"=>$chairman,
        ]);
    }

    // DepartmentAccount
    public function DepartmentAccount(){
        $chairman = User::select("*")->where('role',6)->orderBy('created_at', 'DESC')->get();

        return response()->json([
            "status"=>200,
            "deparmtnetaccount"=>$chairman,
        ]);
    }

    // Department
    public function Department(){
        // $department = Department::select("*")->orderBy('department','ASC')->get();
        $department = DB::table('tbl_department')->leftjoin('tbl_course','tbl_course.deparment_fk','=','tbl_department.id')->selectRaw('tbl_department.department,tbl_department.department_code,tbl_department.id, count(tbl_course.deparment_fk) as total')->groupBy('tbl_department.id')->get();
        return response()->json([
            "status"=>200,
            "department"=>$department,
        ]);
    }

    public function Upload(Request $request){

        // $total = Documents::select('*')->get();

        // if($total->count() > 0){
        //     $count = $total->count();
        //     $nextNumbers = ++$count;
        // }
        // else{
        //     $nextNumbers = 1;
        // }
        // $nextReference = "3FSUU"."".sprintf('%09d',$nextNumbers);  

        $document = new Documents;
        $document->title = $request->input('title');
        $document->keywords = $request->keywords;
        $document->reference_code = $request->barcode;
        $document->description = $request->input('description');
        $document->is_active_docu = 1;
        $document->uniq_key = sha1(time()."".rand(111,999));
        $document->date_published = $request->month." ".$request->year;
        $document->Year_Published = $request->year;
        $document->optional_email = $request->optional;
        $document->save();

        // $new = implode(',',array_filter($request->author));

        $account_email = User::select('*')->whereIn('email',explode(',',$request->names))->pluck('id');
        $pk = $account_email;

        foreach($pk as $key){
            $data = array(
                "document_fk"=>$document->id,
                "author"=>$request->author,
                "author_user_fk"=>$key,
            );
            Authors::insert($data);
        }
        $information = new Information;
        $information->adviser = $request->input('adviser');
        $information->publication = $request->publication;
        $information->department_fk = $request->department;
        $information->course_fk = $request->course;
        $information->docu_fk = $document->id;
        $information->year_fk = $request->Year;
        $information->location = $request->city;

        if($request->hasFile('file') && $request->hasFile('file_complete')){

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $filename = $request->input('title').".".$extension;
            $file->move('Uploads/Files/',$filename);
            $information->file = "Uploads/Files/".$filename;

            $complete = $request->file('file_complete');
            $extensionwhole = $complete->getClientOriginalExtension();
            $filenamecomplete = $request->input('title')." "."Full Info".".".$extensionwhole;
            $complete->move('Uploads/Files/',$filenamecomplete);
            $information->complete = "Uploads/Files/".$filenamecomplete;
        }
        $information->save();

        $logs = new ActivityLogs;
        $logs->activity = $document->title." "."Has Been Published";
        $logs->user_fk = $request->adminkey;
        $logs->save();

        return response()->json([
            "status"=>200,
            "limit"=>$request->hasFile('file'),
            "file"=>$request->hasFile('file_complete'),
            "success"=>$request->input('title')." "."Has Been Published.!",
        ]);
        
    }

    public function Archives(){
        $docu = Documents::select('*')->orderBy('created_at','ASC')->get();

        return response()->json([
            "status"=> 200,
            "data"=>$docu,
        ]);
    }

    public function Remove($id){
        
        $document = Documents::select('id')->whereIn('id',explode(",",$id));

        if($document){
            $document->delete();
            return response()->json([
                "status"=>200,
                "message"=>"Deleted Data Successfully",
            ]);

            // return response()->json([
            //     "status"=>200,   
            //     "data"=>$document,
            // ]);
            
        }
        else{
            return response()->json([
                "error"=> "Data Does Not Exist",
            ]);
        }
    }

    public function Logs($id){
        $logs = ActivityLogs::select('*')->where('user_fk',$id)->get();

        return response()->json([
            "status"=>200,
            "AccountLogs"=> $logs,
        ]);
    }

    public function document($id){
        // eloquent
        $document =  Documents::with('information')->with('authors')->where('id',$id)->first();
        $course = DB::table('tbl_info')->join('tbl_department', 'tbl_info.department_fk','=','tbl_department.id')->join('tbl_course','tbl_course.deparment_fk','=','tbl_department.id')->selectRaw('tbl_department.department as dept,tbl_course.course as cours')->where('tbl_info.docu_fk',$id)->groupBy('tbl_info.department_fk')->first();
        $author = DB::table('users')
            ->join('tbl_authors','tbl_authors.author_user_fk','=','users.id')
            ->selectRaw('users.first_name,users.middle_name,users.last_name')
            ->where('tbl_authors.document_fk',$id)
            ->get();

        return response()->json([
            "status"=>200,
            "document"=>$document,
            "author"=>$author,
            "course"=>$course,
        ]);
    }

    public function AddDepartment(Request $request){

        $validate = Validator::make($request->all(),[
            "deptname" => "required",
            "deptcode" => "required",
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{
            $department = new Department;

            $color = "#"."".$request->colorcode;

            $department->department = $request->deptname;
            $department->department_code = $request->deptcode;
            $department->color_code = $color;
            $department->save();
            $logs = new ActivityLogs;
            $logs->activity = "Added"." ".$request->deptname." "."Department";
            $logs->user_fk = $request->id;

            $logs->save();
            return response()->json([
                "status"=>200,
                "success"=> "You have Successfully Registered",
            ]);
        }
    }

    public function AddCourse(Request $request){

        $course = new Course;

        $course->course = $request->course;
        $course->deparment_fk = $request->deptID;

        $course->save();

        return response()->json([
            "status"=>200,
            "success"=> $request->course." "."Added",
        ]);
    }

    public function CourseFilter($id){

        $course = Course::select('*')->where('deparment_fk',$id)->get();

        if($course){
            return response()->json([
                "status"=>200,
                "Course"=>$course,
            ]);
        }
    }

    public function DeleteCourse($id){

        $course = Course::find($id);

        if($course){
            $course->delete();
            return response()->json([
                "status"=>200,
                "success"=>"Successfully Deleted",
            ]);
        }
    }
    

    public function RemoveDepartment($id){
        $department = Department::find($id);
        if($department){
            $department->delete();

            return response()->json([
                "status"=>200,
                "message"=>"Department Deleted Permanently",
            ]);
        }
    }

    public function Course(){
        $course = Course::all();
        return response()->json([
            "status"=>200,
            "Data"=>$course,
        ]);
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

    public function AddYear(Request $request){

        $year = new Year;
        $year->school_year = $request->newyear;
        $year->save();

        return response()->json([
            "status"=>200,
            "success"=> $request->newyear." "."Registered",
        ]);
    }
    
    
    public function currentYear(){
        $year = Year::select('*')->orderBy('id','DESC')->skip(0)->take(1)->first();

        return response()->json([
            "status"=>200,
            "YearData"=>$year,
        ]);
    }

    public function documentsDetails($id){
        // $document = Documents::with('information')->select('*')->where('id',$id)->first();

        $document = DB::table('tbl_docu')->join('tbl_info', 'tbl_docu.id','=','tbl_info.docu_fk')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')->join('tbl_course','tbl_course.id','=','tbl_info.course_fk')->where('tbl_docu.id','=',$id)->selectRaw('tbl_docu.title,tbl_docu.keywords,tbl_docu.description,tbl_info.adviser,tbl_department.department,tbl_info.publication,tbl_course.course')->first();

        if($document){
            return response()->json([
                "status"=>200,
                "Details"=>$document,
            ]);
        }
        else{
            return response()->json([
                "error"=>"Does Not Exist",
            ]);
        }
    }
    
    public function UpdateArchives(Request $request,$id){
        
        $document = Documents::with('information')->find($id);

        if($document){
            $document->title = $request->input('title');
            $document->description = $request->input('description');
            $document->information->publication = $request->input('publication');
            $document->information->adviser = $request->input('adviser');
            $document->keywords = $request->keywords;
            $document->update();
            $document->information->update();

            return response()->json([
                "status"=>200,
                "message"=>"Updated Data",
            ]);
        }
        else{

        }
    }

    public function FetchDepartment($id){
        $department = Department::find($id);
  
        return response()->json([
            "status"=>200,
            "data"=>$department,
        ]);

    }

    public function DepartmentUpdate(Request $request,$id){
        $department = Department::find($id);

        if($department){
            $department->department = $request->department;

            $department->update();

            return response()->json([
                "status"=>200,
                "message"=> "Successfully Changed",
            ]);
        }
    }

    public function CreateSub(Request $request){

        $validate = Validator::make($request->all(),[
            "email" => "required|email|unique:users,email",
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{

            // $getdept = $request->department != "" ? Department::where('id',$request->department)->first() : "";  
            $year = Year::select('*')->orderBy('id','DESC')->skip(0)->take(1)->first();
            // $department = Department::where('id',$request->department)->first();
            $user = new User;

            $name = $request->fname." ".$request->mname." ".$request->lname;
            
            $user->idnumber = $request->idnum;
            $user->first_name = $request->fname;
            $user->middle_name = $request->mname;
            $user->last_name = $request->lname;
            $user->name = $name;
            $user->email = $request->email;
            $user->department_fk = $request->department;
            $user->school_year_fk  = $year->id;
            // $user->role = 6;
            $user->role = ($request->position == 3 ? 3 : 5);
            $user->is_active = 1;
            $user->position = ($request->position == 3 ? "Dean" : "Chairman");
            $user->save();
            $logs = new ActivityLogs;

            $logs->activity = "Created an account as "."".($request->position == 3 ? "Dean" : "Chairman");
            $logs->user_fk = $request->user_id;
            $logs->save();
            return response()->json([
                "status"=>200,
                "message"=>"Successfully Created",
            ]);
        }
    }

    public function AdminType(Request $request){
        
        $year = Year::select('*')->orderBy('id','DESC')->skip(0)->take(1)->first();
        $user = new User;
        
        $user->idnumber = $request->idnum;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->school_year_fk  = $year->id;
        $user->role = 4;
        $user->position = "Library";
        $user->is_active = 1;
        $user->save();
        $logs = new ActivityLogs;

        $logs->activity = "Created an account as "."".($request->account == 5) ? "Chairman" : "Librarian"; 
        $logs->user_fk = $request->user_id;
        $logs->save();
        return response()->json([
            "status"=>200,
            "message"=>"Successfully Created",
        ]);
    }

    public function AccountInfoCount($id){

        $department = DB::table('tbl_department')->leftjoin('users','users.department_fk','=','tbl_department.id')->leftjoin('tbl_school_year','tbl_school_year.id','=','users.school_year_fk')->selectRaw('tbl_department.department,tbl_department.department_code,tbl_department.id, count(users.department_fk) as total, tbl_school_year.school_year')->where('tbl_school_year.id',$id)->groupBy('tbl_department.id')->get();
        return response()->json([
            "status"=>200,
            "department"=>$department,
        ]);
    }

    public function documentLink($id){
        $data = Authors::select('*')->where('document_fk',$id)->groupBy('document_fk')->get();

        return response()->json([
            "status"=>200,
            "Data"=>$data,
        ]);
    }

    public function AnalyticsDepartment($id){

        // $total = DB::table('tbl_department')->leftjoin('users','users.department_fk','=','tbl_department.id')->selectRaw('users.id,users.school_year_fk,users.email,tbl_department.department_code,users.department_fk, count(users.department_fk) as total')->groupBy('tbl_department.id')->get();
        $total = DB::table('tbl_department')->leftjoin('users','users.department_fk','=','tbl_department.id')->selectRaw('users.email,tbl_department.department_code, count(users.department_fk) as total, users.school_year_fk')->orderBy('tbl_department.department','ASC')->groupBy('users.department_fk','tbl_department.id')->get();
        $analytics = DB::table('tbl_department')->leftjoin('users','users.department_fk','=','tbl_department.id')->selectRaw('tbl_department.department_code, users.school_year_fk')->orderBy('tbl_department.department','ASC')->groupBy('users.department_fk','tbl_department.id')->get();
        return response()->json([
            "status"=>200,
            "count"=>$total,
            "analytics"=>$analytics,
        ]);
    }

    public function AnalyticsDepartmentYear($id){
        $total = DB::table('tbl_department')->leftjoin('users','users.department_fk','=','tbl_department.id')->selectRaw('users.email,tbl_department.department_code, count(users.department_fk) as total, users.school_year_fk')->where('users.school_year_fk',$id)->orderBy('tbl_department.department','ASC')->groupBy('users.department_fk','tbl_department.id')->get();
        $analytics = DB::table('tbl_department')->leftjoin('users','users.department_fk','=','tbl_department.id')->selectRaw('tbl_department.department_code,tbl_department.color_code as color, users.school_year_fk')->where('users.school_year_fk',$id)->orderBy('tbl_department.department','ASC')->groupBy('users.department_fk','tbl_department.id')->get();
       
        if($total->count() > 0 && $analytics->count() > 0){
            return response()->json([
                "status"=>200,
                "count"=>$total,
                "analytics"=>$analytics,
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "count"=>"No Data",
                "analytics"=>"No Data",
            ]);
        }
    }

    public function AnalyticsDocuments($id){

        // $count = DB::table('tbl_info')->leftjoin('tbl_department','tbl_department.id','=','tbl_info.department_fk')->selectRaw('tbl_department.department,tbl_department.department_code,tbl_department.color_code ,count(tbl_info.department_fk) as totaldocuments')->where('tbl_info.year_fk',$id)->groupBy('tbl_department.id')->get();
        // $analytics = DB::table('tbl_department')->leftjoin('users','users.department_fk','=','tbl_department.id')->leftjoin('tbl_school_year','tbl_school_year.id','=','users.school_year_fk')->selectRaw('tbl_department.department,tbl_department.department_code,tbl_department.id, count(users.department_fk) as total, tbl_school_year.school_year')->where('tbl_school_year.id',$id)->groupBy('tbl_department.id')->get();

        $count = DB::table('tbl_info')->join('tbl_department','tbl_department.id','=','tbl_info.department_fk')
        ->selectRaw('tbl_department.department,tbl_department.department_code,tbl_department.color_code ,count(tbl_info.department_fk) as totaldocuments')
        ->where('tbl_info.year_fk',$id)
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

    public function DepartmentName(Request $request){
        $department_name = Department::select('*')->where('id',$request->dep)->first();
        $couse = Course::select('*')->where('id',$request->cour)->first();
        return response()->json([
            "status"=>200,
            "course"=>$couse,
            "dept"=>$department_name,
        ]);
    }

    public function documentDelete($id){
        $document = Documents::find($id);

        if($document){
            $document->delete();
            return response()->json([
                "status"=>200,
                "success"=>"Successfully Deleted",
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "message"=>"Document Does Not Exist",
            ]);
        }
    }

    public function UpdateStatus(Request $request,$id){
        $document = Documents::find($id);

        $status = ($request->view == "User") ? 1 : (($request->view == "Admin") ? 2 : 0);

        if($document){
            $document->is_active_docu = $status;
            $document->update();

            return response()->json([
                "status"=>200,
            ]);
        }
    }

    public function CountAll(){
        $files = Documents::select('*')->get();
        $all = User::select('*')->get();
        $active = User::select('*')->where('is_active',1)->get();
        $notactive = User::select('*')->where('is_active',0)->get();

        
        if($files->count() > 0 || $all->count() > 0 || $active->count() > 0 || $notactive->count() > 0){
            return response()->json([
                "status"=>200,
                "files"=>$files->count(),
                "all"=> $all->count(),
                "active"=>$active->count(),
                "notactive"=>$notactive->count(),
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "files"=>0,
                "all"=>0,
                "active"=>0,
                "notactive"=>0,
            ]);
        }
    }
    public function RatedDocument(){
        // $visits = VisitCount::select('*')->orderBy('visit_count','DESC')->limit(3)->get();
        // $visits = DB::table('tbl_count')->join('tbl_docu','tbl_count.document_access_code','=','tbl_docu.uniq_key')->selectRaw('tbl_count.visit_count,tbl_docu.title')->orderBy('visit_count','DESC')->limit(3)->get();

        $visits = DB::table('tbl_visits')->join('tbl_docu','tbl_visits.document_code','=','tbl_docu.uniq_key')
            ->selectRaw('count(tbl_visits.document_code) as total, tbl_docu.title as name,uniq_key')
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
                "count"=>"No Data To Display",
            ]);
        }
    }

    public function UserData(){
        // $user = User::select('*')->whereIn('role',[2,3,4,5,6])->orderBy('email','ASC')->get();

        $user = DB::table('users')
        ->join('tbl_department','users.department_fk','=','tbl_department.id')
        ->join('tbl_course','users.course_fk','=','tbl_course.id')
        ->selectRaw('users.email,users.name,tbl_department.department,tbl_course.course')
        ->whereIn('role',[2])->orderBy('email','ASC')->get();

        if($user->count() > 0){
            return response()->json([
                "status"=>200,
                "email"=>$user,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "error"=>"No Accounts",
            ]);
        }
    }

    public function SchoolYearDetails($id){
        $sy = Year::where('id',$id)->first();
        return response()->json([
            "status"=>200,
            "details"=>$sy,
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

    public function AdminInbox($id){
        $inbox = DB::table('tbl_msg')->join('users','users.id','=','tbl_msg.ToUser')
        ->selectRaw('tbl_msg.message_id,tbl_msg.subject,users.email,tbl_msg.seen,tbl_msg.created_at')
        ->where('tbl_msg.ToUser',$id)->orderBy('tbl_msg.created_at','DESC')
        ->get();

        // if($inbox->count() >0){
            return response()->json([
                "status"=>200,
                "inbox"=>$inbox,
            ]);
        // }
        // else{
        //     return response()->json([
        //         "status"=>200,
        //         "inbox"=>"No Data To Display",
        //     ]);
        // }
    }

    public function InboxDetails(Request $request)
    {
        $message = Message::with('frominfo')->select('*')->where('message_id',$request->key)->first();

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

    public function SaveAccess(Request $request){

        $tbl = Documents::where('reference_code',$request->barcode)->first();

        if($tbl){
            $create = new AccessLink;
            
            $create->access_key = $request->key;
            $create->document_link_fk = $tbl->id;
            $create->request_fk = $request->userid;
            $create->save();

            $logs = new ActivityLogs;
            $logs->activity = "Create Access Link to"." ".$request->email;
            $logs->user_fk = $request->userfk;

            $logs->save();

            return response()->json([
                "status"=>200,
                "success"=> "Access Link Added",
            ]);

        }
        else{
            return response()->json([
                "status"=>504,
                "error"=> "Message not Found",
            ]);
        }
    }

    public function RecordAccess($id)
    {
        $records = DB::table('tbl__access_link')->join('tbl_docu','tbl__access_link.document_link_fk','=','tbl_docu.id')
        ->selectRaw('tbl_docu.title,tbl_docu.reference_code,tbl__access_link.created_at,tbl__access_link.access_key,tbl__access_link.id')
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

    public function deleteAccess($id){
        $access = AccessLink::whereIn('id',explode(",",$id));

        if($access){
            $access->delete();
            return response()->json([
                "status"=>200,
                "message"=>"Deleted Data Successfully",
            ]);
        }
        else{
            return response()->json([
                "error"=> "Data Does Not Exist",
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
        })->orderBy('title','ASC')
        ->get();

        $yeardetails = DB::table('tbl_docu')
        ->selectRaw('Year_Published, count(Year_Published) as total')
            ->where('is_active_docu',1)
                ->where(function ($query) use ($request){
                    $query->where('title','like',"%$request->search%")
                        ->orWhere('keywords','like',"%$request->search%");
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

    public function SearchEngineResult($id){
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
                })->groupBy('Year_Published')->orderBy('Year_Published','ASC')->get();   

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
            $visits->Readers = "Library";
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

    public function GuessData(){
        $data = Guest::select('*')->orderBy('created_at','DESC')->get();

        return response()->json([
            "status"=>200,
            "guest"=>$data,
        ]);
    }
    public function GuestDataInformation($id){
        $data = Guest::select('*')->where('bookid',$id)->first();
        $booktitle = Documents::select('title')
        ->where('uniq_key',$data->document_code)
        ->first();

        if($data){
            return response()->json([
                "status"=>200,
                "data"=>$data,
                "title"=>$booktitle,
            ]);
        }
        else{
            return response()->json([
                "error"=>"No Data Record's",
            ]);
        }
    }

    public function UpdateGuest(Request $request){
        $update = DB::table('tbl_guessbook')
            ->where('bookid',$request->id)
            ->update(array(
                'fromdate' => $request->from,
                'enddate' => $request->end,
                'status' => 1,
            ));
          $mail = MailController::schedulenotification($request->name, $request->email, $request->from, $request->end);
          if($mail == 0){
            return response()->json([
                "status"=>200,
                "success"=> "Set Scheduled",
            ]);
          }
    }
}
