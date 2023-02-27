<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AccessLink extends Model
{
    use HasFactory;

    protected $table = "tbl__access_link";

    protected $fillable = [
        "access_key",
        "document_link_fk",
        "request_fk"
    ];

    public function user_info(){
        return $this->belongsTo(User::class, 'user_account_fk','id');
    }
}
