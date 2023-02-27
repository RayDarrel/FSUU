import Compose from "../components/Student/Message/Compose";
import Inbox from "../components/Student/Message/Inbox";
import ReadInbox from "../components/Student/Message/ReadInbox";
import Request from "../components/Student/Message/Request";
import SentItems from "../components/Student/Message/SentItems";
import ViewSent from "../components/Student/Message/ViewSent";
import AccountDetails from "../components/Student/Pages/AcountDetails";
import BookForm from "../components/Student/Pages/BookForm";
import Dashboard from "../components/Student/Pages/Dashboard";
import DocumentView from "../components/Student/Pages/DocumentView";
import FsuuCode from "../components/Student/Pages/FsuuCode";
import Logs from "../components/Student/Pages/Logs";
import SearchEngine from "../components/Student/Pages/SearchEngine";
import Status from "../components/Student/Pages/Status";
import View from "../components/Student/Pages/View";
import OpenDocument from "../components/Student/SeachEngineFiles/OpenDocument";
import SearchEngineResult from "../components/Student/SeachEngineFiles/SearchEngineResult";
import Result from "../components/Student/ThesisCode/Result";



const StudentRoutes = [
    {path: '/student/dashboard', exact: true, name: "Dashboard", component: Dashboard},
    // {path: '/student/code', exact: true, name: "Code", component: FsuuCode},
    // {path: '/student/code/search=:id', exact: true, name: "CodeResult", component: Result},
    {path: '/student/search', exact: true, name: "Search", component: SearchEngine},
    {path: '/student/search=:id', exact: true, name: "SearchEngine", component: SearchEngineResult},
    {path: '/student/document/refid=:id', exact: true, name: "Open", component: OpenDocument},
    {path: '/student/compose', exact: true, name: "Compose", component: Compose},
    {path: '/student/inbox', exact: true, name: "Inbox", component: Inbox},
    {path: '/student/items', exact: true, name: "Sent", component: SentItems},
    {path: '/student/view/refid=:id', exact: true, name: "SentView", component: ViewSent},
    {path: '/student/read/ref=:id', exact: true, name: "Read", component: ReadInbox},
    {path: '/student/status', exact: true, name: "Status", component: Status},
    {path: '/student/document/access_key=:id', exact: true, name: "View", component: View},
    {path: '/student/details/docu/refid=:id', exact: true, name: "ViewItem", component: DocumentView},
    {path: '/student/request/refid=:id', exact: true, name: "Request", component: BookForm},
    {path: '/student/account', exact: true, name: "Account", component: AccountDetails},
    {path: '/student/logs', exact: true, name: "Logs", component: Logs},
    
]

export default StudentRoutes;