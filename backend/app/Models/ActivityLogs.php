<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLogs extends Model
{
    use HasFactory;
    
    protected $table = "_activity_logs";

    protected $fillable = [
        "id",
        "activity",
        "user_fk",
    ];

}
