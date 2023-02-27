<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_info', function (Blueprint $table) {
            $table->id();
            $table->string('adviser');
            $table->unsignedBigInteger('department_fk');
            $table->foreign('department_fk')->references('id')->on('tbl_department')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('course_fk');
            $table->foreign('course_fk')->references('id')->on('tbl_course')->onUpdate('cascade')->onDelete('cascade');
            $table->string('file');
            $table->unsignedBigInteger('docu_fk');
            $table->foreign('docu_fk')->references('id')->on('tbl_docu')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('year_fk');
            $table->foreign('year_fk')->references('id')->on('tbl_school_year')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('tbl_info');
    }
}
