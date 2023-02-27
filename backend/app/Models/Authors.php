<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Authors extends Model
{
    use HasFactory;

    protected $table = "tbl_authors";

    protected $fillable = [
        "author",
        "document_fk",
        "author_user_fk",
    ];

    public function useraccount(){
        return $this->belongsTo(User::class, 'author_user_fk','id');
    }
}
