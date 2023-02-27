<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DownloadsPDF extends Model
{
    use HasFactory;

    protected $table = "tbl_download";


    protected $fillable = [
        'title',
        'reference_code',
        'size',
        'info_fk',
    ];
}
