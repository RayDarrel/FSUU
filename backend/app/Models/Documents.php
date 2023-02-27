<?php

namespace App\Models;

use App\Models\Course;
use App\Models\Favorite;
use App\Models\Information;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;

class Documents extends Model
{
    use HasFactory, Searchable;

    protected $table = "tbl_docu";

    protected $fillable = [
        "title",
        "keywords",
        "reference_code",
        "description",
        "date_published",
        "Year_Published",
        "uniq_key",
        "optional_email",
        "is_active_docu",
    ];

    protected $with =[
        'information',
    ];

    public function toSearchableArray(){
        return [
            'title'=> $this->title,
            'keywords'=> $this->keywords,
            'is_active_docu'=> 2,
        ];
    }

    public function information(){
        return $this->belongsTo(Information::class, 'id','docu_fk');
    }
    public function authors(){
        return $this->belongsTo(Authors::class, 'id','document_fk');
    }
    public function favorite(){
        return $this->belongsTo(Favorite::class, 'id','document_fk');
    }

}
