<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblGuessbookTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_guessbook', function (Blueprint $table) {
            $table->id();
            $table->string('bookid');
            $table->string('fullname');
            $table->string('email');
            $table->string('address');
            $table->string('school');
            $table->string('message');
            $table->string('document_code');
            $table->string('fromdate');
            $table->string('enddate');
            $table->string('course_fk');
            $table->string('department_fk');
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
        Schema::dropIfExists('tbl_guessbook');
    }
}
