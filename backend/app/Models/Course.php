<?php

namespace App\Models;

use App\Models\Department;
use App\Models\Information;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;

    protected $table = "tbl_course";

    protected $fillable = [
        "id",
        "course",
        "deparment_fk",
    ];
}
