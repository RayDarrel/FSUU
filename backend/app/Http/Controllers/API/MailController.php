<?php

namespace App\Http\Controllers\API;

use App\Mail\Emails;
use App\Mail\BookSchedule;
use Illuminate\Http\Request;
use App\Mail\BookingNotification;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public static function sendmail($name,$email,$typeaccrole){

        $data = [
            'name'=>$name,
            'position'=>$typeaccrole,
        ];

        Mail::to($email)->send(new Emails($data));
    }
    public static function schedulenotification($name,$email,$from,$end){

        $data = [
            'name'=>$name,
            'email'=>$email,
            'from'=>$from,
            'end'=>$end,
        ];
        Mail::to($email)->send(new BookSchedule($data));
    }

    public static function BookNumberNotification($bookid,$email,$title,$name,$school){

        $data = [
            'bookid' => $bookid,
            'email' => $email,
            'title' => $title,
            'school' => $school,
            'name' => $name,
        ];
        Mail::to($email)->send(new BookingNotification($data));
    }
}
