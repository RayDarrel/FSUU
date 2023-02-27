import AccountDetails from "../components/Admin/AccountDetails/AccountDetails";
import SchoolYear from "../components/Admin/Analytics/SchoolYear";
import Compose from "../components/Admin/Message/Compose";
import Accounts from "../components/Admin/Pages/Accounts";
import Analytics from "../components/Admin/Pages/Analytics";
import Dashboard from "../components/Admin/Pages/Dashboard";
import Delete from "../components/Admin/Pages/Delete";
import Department from "../components/Admin/Pages/Department";
import DepartmentChart from "../components/Admin/Pages/DepartmentChart";
import ImportArchives from "../components/Admin/Pages/ImportArchives";
import ImportCSV from "../components/Admin/Pages/ImportCSV";
import Inbox from "../components/Admin/Message/Inbox";
import Register from "../components/Admin/Pages/Register";
import School from "../components/Admin/Pages/School";
import ThesisCollection from "../components/Admin/Pages/ThesisCollection";
import DocumentDetails from "../components/Admin/ThesisDetails/DocumentDetails";
import DocumentEdit from "../components/Admin/ThesisDetails/DocumentEdit";
import ReadInbox from "../components/Admin/Message/ReadInbox";
import SentItems from "../components/Admin/Message/SentItems";
import SearchEngine from "../components/Admin/Pages/SearchEngine";
import Results from "../components/Admin/SearchEngineResults/Results";
import OpenDocumentTitle from "../components/Admin/SearchEngineResults/OpenDocumentTitle";
import Logs from "../components/Admin/Pages/Logs";
import Booking from "../components/Admin/Pages/Booking";
import GuestData from "../components/Admin/BookFormData/GuestData";


const AdminRoutes = [
    {path: '/admin/dashboard', exact: true, name: "Dashbaord", component: Dashboard},
    {path: '/admin/collection', exact: true, name: "Thesis", component: ThesisCollection},
    {path: '/admin/collection/upload', exact: true, name: "ThesisImport", component: ImportArchives},
    {path: '/admin/accounts', exact: true, name: "Accounts", component: Accounts},
    {path: '/admin/school', exact: true, name: "School", component: School},
    {path: '/admin/register', exact: true, name: "Register", component: Register},
    {path: '/admin/search', exact: true, name: "Search", component: SearchEngine},
    {path: '/admin/search=:id', exact: true, name: "SearchResult", component: Results},
    {path: '/admin/department', exact: true, name: "Department", component: Department},
    {path: '/admin/import', exact: true, name: "Import", component: ImportCSV},
    {path: '/admin/delete', exact: true, name: "Remove", component: Delete},
    {path: '/admin/message', exact: true, name: "Message", component: Compose},
    {path: '/admin/inbox', exact: true, name: "Inbox", component: Inbox},
    {path: '/admin/sent', exact: true, name: "SentItem", component: SentItems},
    {path: '/admin/organization', exact: true, name: "Organization", component: DepartmentChart},
    {path: '/admin/analytics', exact: true, name: "Analytics", component: Analytics},
    {path: '/admin/read/refid=:id', exact: true, name: "Read", component: ReadInbox},
    {path: '/admin/collection/refid=:id', exact: true, name: "DocumentDetails", component: DocumentDetails},
    {path: '/admin/collection/edit/refid=:id', exact: true, name: "Edit", component: DocumentEdit},
    {path: '/admin/account/refid=:id', exact: true, name: "Account", component: AccountDetails},
    {path: '/admin/yeardetails/refid=:id', exact: true, name: "YearDetails", component: SchoolYear},
    {path: '/admin/document/refid=:id', exact: true, name: "DetailsDocument", component: OpenDocumentTitle},
    {path: '/admin/logs', exact: true, name: "Logs", component: Logs},
    {path: '/admin/booking', exact: true, name: "Booking", component: Booking},
    {path: '/admin/book/refid=:id', exact: true, name: "BookingData", component: GuestData},
    
   
]

export default AdminRoutes