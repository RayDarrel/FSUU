<?php

namespace App\Models;

use App\Models\Course;
use App\Models\Documents;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Information extends Model
{
    use HasFactory;

    protected $table = "tbl_info";

    protected $fillable = [
        "adviser",
        "department_fk",
        "course_fk",
        "file",
        "location",
        'docu_fk',
    ];

    protected $relation =[
        'course',
    ];    

    public function course(){
        return $this->belongsTo(Course::class,'course_fk','id');
    }
    public function department(){
        return $this->belongsTo(Department::class,'department_fk','id');
    }

    

    
}
