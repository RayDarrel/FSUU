<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblMemberTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_member', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('child_leader_fk');
            $table->foreign('child_leader_fk')->references('id')->on('tbl_leader')->onUpdate('cascade')->onDelete('cascade');

            $table->unsignedBigInteger('child_user_fk');
            $table->foreign('child_user_fk')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('tbl_member');
    }
}
