<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visits extends Model
{
    use HasFactory;

    protected $table = "tbl_visits";

    protected $fillable = [
        'document_code',
        'IP',
        'user_fk',
        'Readers',
    ];
}
