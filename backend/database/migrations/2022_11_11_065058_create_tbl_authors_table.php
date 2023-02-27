<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblAuthorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_authors', function (Blueprint $table) {
            $table->id();
            $table->string('author1')->nullable();
            $table->string('author2')->nullable();
            $table->string('author3')->nullable();
            $table->unsignedBigInteger('document_fk');
            $table->foreign('document_fk')->references('id')->on('tbl_docu')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('tbl_authors');
    }
}
