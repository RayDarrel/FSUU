<?php

namespace App\Models;

use App\Models\GroupMember;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaderGroup extends Model
{
    use HasFactory;

    protected $table = "tbl_leader";

    protected $fillable = [
        "title",
        "GroupNumber",
        "adviser",
        "leader_account_fk",
        "group_year_fk",
        "group_department_fk",
        "created_at",
        "updated_at",
    ];


    public function leader(){
        return $this->belongsTo(GroupMember::class, 'leader_id','child_leader_fk');
    }
}
