<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = "tbl_department";

    protected $fillable =[
        "id",
        "department",
        "department_code",
        "color_code",
    ];

    public function department(){
        return $this->hasOne(Information::class);
    }

    public function course(){
        return $this->belongsTo(Course::class,'id','deparment_fk');
    }
}
