@component('mail::message')

Hello <br><h4>{{$data['name']}}</h4>,

<div class="box">
    <p>Your Urios Email Has been Registered as a {{$data['position']}} at Father Saturnino Urios University Thesis Archives. </p>
        <br>
    <p>You May now Login using your urios email.</p>
</div>



Thanks,<br>
Father Saturnino Urios University
@endcomponent
