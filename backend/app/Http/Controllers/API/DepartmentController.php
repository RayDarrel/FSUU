<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Year;
use App\Models\Course;
use App\Models\Department;
use App\Models\GroupMember;
use App\Models\LeaderGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    
    public function departmentInfo($id){

        $info = DB::table('users')->join('tbl_department','users.department_fk','=','tbl_department.id')->where('users.id','=',$id)->first();

        return response()->json([
            "status"=>200,
            "Data"=>$info,
        ]);
    }

    public function FetchAccount($id){
        $getfk = User::select('department_fk')->where('id',$id)->first();

        $data = User::select('*')->where('department_fk',$getfk->department_fk)->where('role',2)->orderBy('name','ASC')->get();

        return response()->json([
            "status"=>200,
            "Data"=>$data,
        ]);
    }

    public function accountremove($id){

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

    public function datagroupremove($id){

        $user = LeaderGroup::select('id')->whereIn('id',explode(",",$id));

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

    public function departmentCource($id){
        $getfk = User::select('department_fk')->where('id',$id)->first();

        $department = Course::select('*')->where('deparment_fk',$getfk->department_fk)->get();

        return response()->json([
            "status"=>200,
            "Data"=>$department,
        ]);
    }

    public function DepartmentYear(){
        $year = Year::select('*')->orderBy('id','DESC')->skip(0)->take(1)->get();

        return response()->json([
            "status"=>200,
            "YearData"=>$year,
        ]);
    }

    public function CreateAccount(Request $request){

        $validate = Validator::make($request->all(),[
            "idnumber"=>"required",
            "email"=>"required|unique:users,email",
            "fname"=>"required",
            "mname"=>"required",
            "lname"=>"required",
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{

            $get = User::select('department_fk')->where('id',$request->id)->first();
            $year = Year::select('id')->where('school_year',$request->year)->first();

            $user = new User;
            $name = $request->fname." ".$request->mname." ".$request->lname;

            $user->idnumber = $request->idnumber;
            $user->name = $name;
            $user->email = $request->email;
            $user->department_fk = $get->department_fk;
            $user->course_fk = $request->course;
            $user->school_year_fk = $year->id;
            $user->role = 2;
            $user->position = "Student";
            $user->save();

            return response()->json([
                "status"=>200,
                "message"=> "Successfully Created Account",
            ]);
        }
    }
    public function AddGroup(Request $request, $id){

        $validate = Validator::make($request->all(),[
            "title"=>"required",
            "adviser"=>"required",
            "leader"=>"required",
        ]);

        if($validate->fails()){
            return response()->json([
                "error"=> $validate->messages(),
            ]);
        }
        else{
            // eloquent
            $year = Year::select('id')->where('school_year',$request->year)->first();
            $leader = User::select('*')->where('email',$request->leader)->first();
            $department = Department::select('*')->where('id',$leader->department_fk)->first();
            
            if($leader){

                $num = rand(111,999);
                $num2 = rand(111,999);
                $code = $num."".$num2;

                $GroupLeader = new LeaderGroup;
                $GroupLeader->title = $request->title;
                $GroupLeader->GroupNumber = $code;
                $GroupLeader->adviser = $request->adviser;
                $GroupLeader->leader_account_fk = $leader->id;
                $GroupLeader->group_department_fk = $department->id;
                $GroupLeader->group_year_fk = $year->id;

                $GroupLeader->save();

                $groupemail = implode(',',array_filter($request->emails));
                $account_email = User::select('*')->whereIn('email',explode(',',$groupemail))->pluck('id');
                $pk = $account_email;

                foreach($pk as $key){
                    $data = array(
                        'child_leader_fk' => $GroupLeader->id,
                        'child_user_fk' => $key,
                        'created_at' =>  date_create(),
                    );
                    GroupMember::insert($data);
                }

                return response()->json([
                    "status"=>200,
                    "success"=>"Group has been registered",
                ]);
            }
            else{
                return response()->json([
                    "status" => 504,
                    "erroremail" => "Group Leader Email Does Not Exist",
                ]);
            }
        }   
    }

    public function FetchGroup($id){

        $getfk = User::select('department_fk')->where('id',$id)->first();
        $department = Department::select('*')->where('id',$getfk->department_fk)->first();
        $groupData = DB::table('tbl_leader')->join('users','tbl_leader.leader_account_fk','=','users.id')->where('group_department_fk','=',$department->id)->get();
        
        return response()->json([
            "status"=>200,
            "Data"=>$groupData,
        ]);
    }

    public function groupinformation($id){
        $tbl_leader = LeaderGroup::select('*')->where('GroupNumber',$id)->first();

        $data = DB::table('tbl_leader')->join('tbl_member','tbl_member.child_leader_fk','=','tbl_leader.id')->join('users','users.id','=','tbl_leader.leader_account_fk')->where('tbl_leader.id','=',$tbl_leader->id)->groupBy('tbl_leader.id')->get();

        $group = GroupMember::with('groupmembernames')->where('child_leader_fk',$tbl_leader->id)->get();

        // $data = LeaderGroup::with('leader')->select('*')->where('leader_id',$id)->get();

        return response()->json([
            "status" =>200,
            "Group"=>$group,
            "Data"=>$data,
        ]);
    }

    public function departmentDocument(){
        
        $data = DB::table('tbl_leader')->join('tbl_member','tbl_member.child_leader_fk','=','tbl_leader.id')->join('users','users.id','=','tbl_leader.leader_account_fk')->groupBy('tbl_leader.id')->get();

        return response()->json([
            "status" =>200,
            "Data"=>$data,
        ]);
    }

    public function DepartmentDocumentDetails($id){
        $user = User::select('*')->where('id',$id)->first();

        $document = DB::table('tbl_info')->join('tbl_docu','tbl_info.docu_fk','=','tbl_docu.id')->where('tbl_info.department_fk',$user->department_fk)->get();

        return response()->json([
            "status"=>200,
            "Data"=>$document,
        ]);
    }

    public function searchdocument(Request $request){
        $details = Documents::with('information')->select('*')->where('reference_code',$request->code)->first();
        return response()->json([
            "status"=>200,
            "Data" =>$details,
        ]);
    }

    public function GroupDataInformation($id){
        $leader = LeaderGroup::select('*')->where('GroupNumber',$id)->first();


        return response()->json([
            "status"=>200,
            "DataGroup"=>$leader,
        ]);
    }
}
