<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMember extends Model
{
    use HasFactory;

    protected $table = "tbl_member";

    protected $fillable =[
        "child_leader_fk",
        "child_user_fk",
    ];

    public function groupmembernames(){
        return $this->belongsTo(User::class, 'child_user_fk','id');
    }
    
}
