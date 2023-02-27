<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthControl;
use App\Http\Controllers\API\DeanController;
use App\Http\Controllers\API\SearchDocument;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\StudenController;
use App\Http\Controllers\API\LibraryController;
use App\Http\Controllers\API\ChairmanController;
use App\Http\Controllers\API\DepartmentController;



// Login
Route::post('login',[AuthControl::class, 'login']);

// 
Route::post('DocumentFilter',[SearchDocument::class, 'Search']);
Route::post('MostRecentFiles',[SearchDocument::class, 'MostRecentFiles']);
Route::post('SearchDocument',[SearchDocument::class, 'SearchEngine']);
Route::post('SearchResults/{id}',[SearchDocument::class, 'SearchResults']);
Route::post('IpAddressregister',[SearchDocument::class, 'IpAddressregister']);
Route::get('DocumentInfo/{id}',[SearchDocument::class, 'DocumentInfo']);
Route::get('Visitschart/{id}',[SearchDocument::class, 'Visitschart']);
Route::get('NameDocument/{id}',[SearchDocument::class, 'NameDocument']);
Route::post('RegisterForm',[SearchDocument::class, 'RegisterForm']);


// Account Details
Route::post('AccountDetails/{id}',[AuthControl::class, 'AccountDetails']);
Route::get('Readers',[AuthControl::class, 'Readers']);

// Admin Router
Route::middleware(['auth:sanctum','isAPIAdmin'])->group(function () {
    Route::get('/checkingAuthenticated', function (){
        return response()->json([
            "role"=>auth()->user()->role,
            "status"=>200,
            "message"=> "OK!",
        ],200);
    });
    Route::post('import', [AdminController::class, 'import_student']);
    Route::get('StudentData',[AdminController::class, 'StudentData']);
    Route::get('SearchStudent/{id}',[AdminController::class,'Search']);
    Route::post('update_student/{id}',[AdminController::class, 'Update']);
    Route::post('saveData',[AdminController::class, 'Save']);
    Route::post('delete/{id}',[AdminController::class, 'delete']);
    Route::get('Dean',[AdminController::class, 'DeanData']);
    Route::get('library',[AdminController::class, 'LibraryData']);
    Route::get('chairman',[AdminController::class, 'Chairman']);
    Route::get('department',[AdminController::class, 'Department']);
    Route::post('upload',[AdminController::class, 'Upload']);
    Route::get('archives',[AdminController::class, 'Archives']);
    Route::post('RemoveArchive/{id}',[AdminController::class, "Remove"]);
    Route::get('AdminLogs/{id}',[AdminController::class, 'Logs']);
    Route::get('document/{id}', [AdminController::class, 'document']);
    Route::post('AddCourse',[AdminController::class, 'AddCourse']);
    Route::post('filterCourse/{id}', [AdminController::class, 'CourseFilter']);
    Route::post('deleteCourse/{id}',[AdminController::class, 'DeleteCourse']);
    Route::post('removeDepartment/{id}', [AdminController::class, 'RemoveDepartment']);
    Route::post('AddDepartment',[AdminController::class, 'AddDepartment']);
    Route::post('Course',[AdminController::class, 'Course']);
    Route::get('SchoolYear',[AdminController:: class, 'SchoolYear']);
    Route::post('AddYear',[AdminController::class, 'AddYear']);
    Route::get('currentYear',[AdminController::class, 'currentYear']);
    Route::get('documentsDetails/{id}',[AdminController::class, 'documentsDetails']);
    Route::get('recycle',[AdminController::class, 'Recycle']);
    Route::put('UpdateData/{id}',[AdminController::class, 'UpdateArchives']);
    Route::get('FetchDepartment/{id}',[AdminController::class, 'FetchDepartment']);
    Route::put('DepartmentUpdate/{id}',[AdminController::class, 'DepartmentUpdate']);
    Route::post('CreateSub',[AdminController::class, 'CreateSub']);
    Route::get('AccountInfoCount/{id}',[AdminController::class, 'AccountInfoCount']);
    Route::get('documentLink/{id}',[AdminController::class, 'documentLink']);
    Route::post('AnalyticsDepartment/{id}',[AdminController::class, 'AnalyticsDepartment']);
    Route::post('AnalyticsDocuments/{id}',[AdminController::class, 'AnalyticsDocuments']);
    Route::post('AnalyticsDepartmentYear/{id}',[AdminController::class, 'AnalyticsDepartmentYear']);
    Route::get('DepartmentName/{id}/{cour}',[AdminController::class, 'DepartmentName']);
    Route::post('documentDelete/{id}',[AdminController::class, 'documentDelete']);
    Route::put('UpdateStatus/{id}',[AdminController::class, 'UpdateStatus']);
    Route::get('CountAll',[AdminController::class, 'CountAll']);
    Route::get('RatedDocument',[AdminController::class, 'RatedDocument']);
    Route::post('AdminType',[AdminController::class, 'AdminType']);
    Route::put('UpdateStatusAccount',[AdminController::class, 'UpdateStatusAccount']);
    Route::get('UserData',[AdminController::class, 'UserData']);
    Route::post('DepartmentName',[AdminController::class, 'DepartmentName']);
    Route::get('departmentaccounts',[AdminController::class, 'DepartmentAccount']);
    Route::get('AllAnalyticsDocuments',[AdminController::class, 'AllAnalyticsDocuments']);
    Route::post('SchoolYearDetails/{id}',[AdminController::class, 'SchoolYearDetails']);
    Route::get('AllAccountsSchoolYear',[AdminController::class, 'AllAccountsSchoolYear']);
    Route::post('SendMessage',[AdminController::class, 'SendMessage']);
    Route::get('AdminInbox/{id}',[AdminController::class, 'AdminInbox']);
    Route::post('InboxDetails',[AdminController::class, 'InboxDetails']);
    Route::post('SaveAccess',[AdminController::class, 'SaveAccess']);
    Route::get('RecordAccess/{id}',[AdminController::class, 'RecordAccess']);
    Route::post('deleteAccess/{id}',[AdminController::class, 'deleteAccess']);
    Route::get('MessageItem/{id}',[AdminController::class, 'MessageItem']);
    Route::post('CountMsg/{id}',[AdminController::class, 'CountMsg']);
    Route::post('SearchEngined',[AdminController::class, 'SearchEngine']);
    Route::post('SearchEngineResults/{id}',[AdminController::class, 'SearchEngineResult']);
    Route::get('DocumentDataadmin/{id}',[AdminController::class, 'DocumentData']);
    Route::post('IpAddressAccessadmin',[AdminController::class, 'IpAddressAccess']);
    Route::get('Visitorsadmin/{id}',[AdminController::class, 'Visitors']);
    Route::post('guessdata',[AdminController::class, 'GuessData']);
    Route::post('GuestData/{id}',[AdminController::class, 'GuestDataInformation']);
    Route::put('UpdateGuest',[AdminController::class, 'UpdateGuest']);
    
});


// Student Router
Route::middleware(['auth:sanctum', 'isAPIStudent'])->group(function () {
    Route::get('/checkingAuthenticate', function (){
        return response()->json([
            "role"=>auth()->user()->role,
            "status"=>200,
            "message"=> "OK!",
        ],200);
    });
    Route::get('search',[SearchDocument::class, 'Search']); 
    Route::post('StudentInfo/{id}',[StudenController::class, 'Search']);
    Route::post('searchCode', [StudenController::class, 'searchCode']);
    Route::post('CodeChecking/{id}',[StudenController::class, 'Checking']);
    Route::get('Favorite/{id}',[StudenController::class, 'Favorite']);
    Route::get('ActivityLogsStudent/{id}',[StudenController::class, 'Logs']);
    Route::post('RemoveFavorite/{id}', [StudenController::class, 'Remove']);
    Route::post('AddFavorite', [StudenController::class, 'AddFavorite']);
    Route::get('getStatusFavorite/{id}',[StudenController::class, 'GetStatus']);
    Route::post('RemoveItem',[StudenController::class, 'RemoveItem']);
    Route::post('Download',[StudenController::class, 'download']);
    Route::post('RemoveDownload',[StudenController::class, 'RemoveDownload']);
    Route::post('FetchDownloads/{id}', [StudenController::class, 'FetchDownloads']);
    Route::post('SendComposeStudent', [StudenController::class, 'ComposeSent']);
    Route::get('fetchMessageSent/{id}', [StudenController::class, 'fetchMessage']);
    Route::get('SentItemsData/{id}', [StudenController::class, 'SentItemsData']);
    Route::get('StudentInbox/{id}', [StudenController::class, 'StudentInbox']);
    Route::post('StudentSeen/{id}', [StudenController::class, 'StudentSeen']);
    Route::get('StudentReadInbox/{id}', [StudenController::class, 'StudentReadInbox']);
    Route::post('studentCourse',[StudenController::class, 'studentCourse']);
    Route::get('studentDepartment',[StudenController::class, 'studentDepartment']);
    Route::post('sendrequest',[StudenController::class, 'sendrequest']);
    Route::get('requestStatus/{id}',[StudenController::class, 'requestStatus']);
    Route::post('getDocuemntDetails/{id}',[StudenController::class, 'getDocuemntDetails']);
    Route::get('KeyAccess/{id}',[StudenController::class, 'KeyAccess']);
    Route::get('identification/{id}',[StudenController::class, 'identification']);
    Route::post('SearchEngine',[StudenController::class, 'SearchEngine']);
    Route::post('SearchEngineResult/{id}',[StudenController::class, 'SearchEngineResult']);
    Route::get('AbstractDocument/{id}',[StudenController::class, 'AbstractDocument']);
    Route::post('SearchEngineAuthor',[StudenController::class, 'SearchEngineAuthor']);
    Route::get('ThesisDocument/{id}',[StudenController::class, 'ThesisDocument']);
    Route::get('DocumentThesis/{id}',[StudenController::class, 'DocumentThesis']);
    Route::post('DocumentData',[StudenController::class, 'DocumentData']);
    Route::post('IpAddressAccess',[StudenController::class, 'IpAddressAccess']);
    Route::get('Visitors/{id}',[StudenController::class, 'Visitors']);
    Route::get('AccessLink/{id}',[StudenController::class, 'AccessLink']);
    Route::post('AccessChecking/{id}',[StudenController::class, 'AccessChecking']);
    Route::get('DocumentDetails/{id}',[StudenController::class, 'DocumentDetails']);
    
});


// Dean Routes
Route::middleware(['auth:sanctum', 'isAPIDean'])->group(function () {
    Route::get('/checking',function() {
        return response()->json([
            "role"=>auth()->user()->role,
            "status"=>200,
            "message"=> "OK!",
        ],200);
    });
    Route::post('CountMsgdean/{id}',[DeanController::class, 'CountMsg']);
    Route::post('SearchEnginedean',[DeanController::class, 'SearchEngine']);
    Route::post('SearchEngineResultdean/{id}',[DeanController::class, 'SearchEngineResult']);
    Route::get('Visitorsdean/{id}',[DeanController::class, 'Visitors']);
    Route::get('DocumentDatadean/{id}', [DeanController::class, 'DocumentData']);
    Route::post('IpAddressAccessdean',[DeanController::class, 'IpAddressAccess']);
    Route::get('StudentDataDean/{id}', [DeanController::class, 'StudentDataDean']);
    Route::post('getinfo/{id}',[DeanController::class, 'getinfo']);
    Route::get('archivesdean/{id}', [DeanController::class, 'archivesdean']);
    Route::post('CourseSelected',[DeanController::class, 'CourseSelected']);
    Route::post('RegisterAccount',[DeanController::class, 'RegisterAccount']);
    Route::post('importdata',[DeanController::class, 'importdata']);
    Route::post('Dashboard',[DeanController::class, 'Dashboard']);
    Route::post('BarData',[DeanController::class, 'BarData']);
    Route::post('DetailsDocu',[DeanController::class, 'DetailsDocu']);
    Route::get('ActivityLogs/{id}',[DeanController::class, 'ActivityLogs']);
    Route::post('SendCompose',[DeanController::class, 'SendCompose']);
    Route::get('FacultyInbox/{id}',[DeanController::class, 'FacultyInbox']);
    Route::get('DeanReadData/{id}',[DeanController::class, 'DeanReadData']);
    Route::get('fetchMessageSentFaculty/{id}',[DeanController::class, 'fetchMessageSentFaculty']);
    Route::get('SentItemsDataFaculty/{id}',[DeanController::class, 'SentItemsDataFaculty']);
    
});


// Chairman Rooutes
Route::middleware(['auth:sanctum','isAPIChairman'])->group(function (){
    Route::get('/identfy', function(){
        return response()->json([
            "role"=>auth()->user()->role,
            "status"=>200,
            "message"=> "OK!",
        ]);
    });
});



// Logout
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout',[AuthControl::class, 'Logout']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
