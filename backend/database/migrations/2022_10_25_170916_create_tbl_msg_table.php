<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblMsgTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_msg', function (Blueprint $table) {
            $table->id();
            $table->string('message_id');
            $table->string('subject')->nullable();
            $table->unsignedBigInteger('ToUser');
            $table->foreign('ToUser')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('FromUser');
            $table->foreign('FromUser')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('file')->nullable();
            $table->integer('seen')->default(0);
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
        Schema::dropIfExists('tbl_msg');
    }
}
