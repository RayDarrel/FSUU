<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblDownloadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_download', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('reference_code');
            $table->string('size');
            $table->unsignedBigInteger('info_fk');
            $table->foreign('info_fk')->references('id')->on('tbl_info')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('user_fk');
            $table->foreign('user_fk')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('tbl_download');
    }
}
