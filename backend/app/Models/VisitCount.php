<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitCount extends Model
{
    use HasFactory;

    protected $table = "tbl_count";

    protected $fillable = [
        'document_access_code',
        'visit_count',
    ];
}
