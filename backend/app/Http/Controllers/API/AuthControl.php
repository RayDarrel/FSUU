<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AuthControl extends Controller
{
    public function login(Request $request){

        $user = User::where([
            ["email", $request->email]
        ])->first();

        $name = $request->firstname." ".$request->lastname;

        if($user){
            if($user->is_verified == 0){
                $user->name = $name;
                $user->googleID = $request->ID;
                $user->is_verified = 1;
                $user->save();
                
                if($user->role == 1){
                    $token = $user->createToken($user->email.'_Admin',['server:admin'])->plainTextToken;
                }
                else if($user->role == 2){
                    $token = $user->createToken($user->email.'_Student',['server:student'])->plainTextToken;
                }
                else if($user->role == 3){
                    $token = $user->createToken($user->email.'_Dean',['server:dean'])->plainTextToken;
                }
                else if($user->role == 4){
                    $token = $user->createToken($user->email.'_Library',['server:library'])->plainTextToken;
                }
                else if($user->role == 5){
                    $token = $user->createToken($user->email.'_Chairman',['server:chairman'])->plainTextToken;
                }
                else if($user->role == 6){
                    $token = $user->createToken($user->email.'_Department',['server:department'])->plainTextToken;
                }
                return response()->json([
                    "status"=>200,
                    "role"=>$user->role,
                    "id"=>$user->id,
                    "token"=>$token,
                    "message"=>"Logged In Successfuly",
                ]);
            }
            else{
                if($user->is_active == 1){
                    if($user->role == 1){
                        $token = $user->createToken($user->email.'_Admin',['server:admin'])->plainTextToken;
                    }
                    else if($user->role == 2){
                        $token = $user->createToken($user->email.'_Student',['server:student'])->plainTextToken;
                    }
                    else if($user->role == 3){
                        $token = $user->createToken($user->email.'_Dean',['server:dean'])->plainTextToken;
                    }
                    else if($user->role == 4){
                        $token = $user->createToken($user->email.'_Library',['server:library'])->plainTextToken;
                    }
                    else if($user->role == 5){
                        $token = $user->createToken($user->email.'_Chairman',['server:chairman'])->plainTextToken;
                    }
                    else if($user->role == 6){
                        $token = $user->createToken($user->email.'_Department',['server:department'])->plainTextToken;
                    }
                    return response()->json([
                        "status"=>200,
                        "role"=>$user->role,
                        "id"=>$user->id,
                        "token"=>$token,
                        "message"=>"Logged In Successfuly",
                    ]);
                }
                else{
                    return response()->json([
                        "status"=>504,
                        "message"=> "Your Account is Locked.!"."\n"."Please Contact The Admin to Activate Your Account",
                    ]);
                }
            }
        }
        else{
            return response()->json([
                "status"=>404,
                "error"=> $request->email." "."Does Not Exist",
            ]);
        }
    }

    // Logout
    public function Logout(){
        auth()->user()->tokens()->delete();

        return response()->json([
            "status"=>200,
            'message'=>"Logout Successfully",
        ]);
    }

    public function AccountDetails($id){
        $user = DB::table('users')->join('tbl_department','users.department_fk','=','tbl_department.id')
            ->leftjoin('tbl_course','users.course_fk','=','tbl_course.id')
            ->join('tbl_school_year','users.school_year_fk','=','tbl_school_year.id')
            ->selectRaw('users.first_name,users.middle_name,users.last_name,users.email,users.idnumber,tbl_department.department,tbl_course.course,users.position,tbl_school_year.school_year,users.created_at')
            ->where('users.id',$id)
            ->first();

        if($user){
            return response()->json([
                "status"=>200,
                "User"=>$user,
            ]);
        }
        else{
            return response()->json([
                "status"=>504,
                "id"=>$id,
                "error"=> "User's Not Found",
            ]);
        }
    }


    // Readers
    public function Readers(){
        $reader = DB::table('tbl_visits')->selectRaw('count(document_code) as total, Readers')
        ->orderBy('total','DESC')
        ->groupBy('Readers')
        ->get();

        if($reader->count() > 0){
            return response()->json([
                "status"=>200,
                "readers"=>$reader,
            ]);
        }
        else{
            return response()->json([
                "status"=>200,
                "readers"=>"No Data",
            ]);
        }
    }

}
