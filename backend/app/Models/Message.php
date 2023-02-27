<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $table = "tbl_msg";

    protected $fillable = [
        'message_id',
        'message_text',
        'subject',
        'ToUser',
        'FromUser',
        'file',
        'seen',
    ];

    // protected $with =['user'];

    public function usersinfo(){
        return $this->belongsTo(User::class,'ToUser','id');
    }

    public function frominfo(){
        return $this->belongsTo(User::class,'FromUser','id');
    }

}
