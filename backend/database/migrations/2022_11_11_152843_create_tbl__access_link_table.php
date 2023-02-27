<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblAccessLinkTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl__access_link', function (Blueprint $table) {
            $table->id();
            $table->string('access_key');
            $table->unsignedBigInteger('document_link_fk');
            $table->foreign('document_link_fk')->references('id')->on('tbl_docu')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('request_fk');
            $table->foreign('request_fk')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('tbl__access_link');
    }
}
