<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblRequestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_request', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('purpose');
            $table->integer('status')->default(0); // 0 pending // 1 approved // 2 Cancel
            $table->unsignedBigInteger('request_user_fk');
            $table->foreign('request_user_fk')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('request_course_fk');
            $table->foreign('request_course_fk')->references('id')->on('tbl_course')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('request_department_fk');
            $table->foreign('request_department_fk')->references('id')->on('tbl_department')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('tbl_request');
    }
}
