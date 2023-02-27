<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('idnumber');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('googleID')->nullable();
            $table->unsignedBigInteger('department_fk');
            $table->foreign('department_fk')->references('id')->on('tbl_department')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('course_fk');
            $table->foreign('course_fk')->references('id')->on('tbl_course')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('school_year_fk');
            $table->foreign('school_year_fk')->references('id')->on('tbl_school_year')->onUpdate('cascade')->onDelete('cascade');
            $table->string('position')->nullable();
            $table->string('year_level')->nullable();
            $table->tinyInteger('role');
            $table->tinyInteger('is_active')->default(0);
            $table->tinyInteger('is_verified')->default(0);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
