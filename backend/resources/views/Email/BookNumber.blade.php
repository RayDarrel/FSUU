@component('mail::message')

Hello <br><h4>{{$data['name']}}</h4>,

<div class="box">
    <h4>Successfully Submitted Booking Form</h4>
    <br> 
    <span>This is your data information.</span>
    <br>
    <b>Book Number: </b> <span>{{$data['bookid']}}</span>
    <br>
    <b>Book Title: </b> <span>{{$data['title']}}</span>
    <br>
    <b>School: </b> <span>{{$data['school']}}</span>
    <br>
    <b>Email: </b> <span>{{$data['email']}}</span>
    <br>
    <span>Please Wait for the schedule from the library.</span>
</div>



Thanks,<br>
Father Saturnino Urios University
@endcomponent
