<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class APIStudentMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check()){
            
            if(auth()->user()->tokenCan('server:student')){
                return $next($request);
            }
            else{
                return response()->json([
                    "token"=> auth()->user()->role,
                    "message"=> "This Page is for Student's",
                ],403);
            }
        }
        else{
            return response()->json([
                "status"=> 401,
                "message"=> "You Must Login First",
            ]);
        }
    }
}
