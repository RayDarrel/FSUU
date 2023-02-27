<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $table = "tbl_favorite";

    protected $fillable = [
        "user_fk",
        "document_fk"
    ];

    protected $with= ['favorite'];
    
    public function favorite(){
        return $this->belongsTo(Documents::class, 'document_fk','id');
    }
}
