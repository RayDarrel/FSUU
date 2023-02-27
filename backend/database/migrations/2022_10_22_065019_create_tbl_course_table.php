<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblCourseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_course', function (Blueprint $table) {
            $table->id();
            $table->string('course');
            $table->unsignedBigInteger('deparment_fk');
            $table->foreign('department_fk')->references('id')->on('tbl_department')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_course');
    }
}
