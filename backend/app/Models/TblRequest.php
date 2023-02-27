<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblRequest extends Model
{
    use HasFactory;

    protected $table = "tbl_request";

    protected $fillable =[
        "subject",
        "name",
        "email",
        "purpose",
        "status",
        "request_department_fk",
    ];
}
