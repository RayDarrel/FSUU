<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblGroupTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_leader', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('adviser');
            $table->unsignedBigInteger('leader_account_fk');
            $table->foreign('leader_account_fk')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->integer('status')->default(0); // 0 pending // 1 approved // 2 On Progress
            $table->unsignedBigInteger('group_year_fk');
            $table->foreign('group_year_fk')->references('id')->on('tbl_school_year')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('group_department_fk');
            $table->foreign('group_department_fk')->references('id')->on('tbl_department')->onUpdate('cascade')->onDelete('cascade');
            
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
        Schema::dropIfExists('tbl_group');
    }
}
