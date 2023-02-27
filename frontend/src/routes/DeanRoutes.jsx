import Compose from "../components/Dean/Message/Compose"
import Inbox from "../components/Dean/Message/Inbox"
import ReadInbox from "../components/Dean/Message/ReadInbox"
import ReadSent from "../components/Dean/Message/ReadSent"
import Sent from "../components/Dean/Message/Sent"
import AccountDetails from "../components/Dean/Pages/AccountDetails"
import Dashboard from "../components/Dean/Pages/Dashboard"
import DocumentDetails from "../components/Dean/Pages/DocumentDetails"
import ImportCSV from "../components/Dean/Pages/ImportCSV"
import Logs from "../components/Dean/Pages/Logs"
import RegisterAccount from "../components/Dean/Pages/RegisterAccount"
import SearchEngine from "../components/Dean/Pages/SearchEngine"
import Account from "../components/Dean/SearchEngineResult/Account"
import OpenDocument from "../components/Dean/SearchEngineResult/OpenDocument"
import SearchEngineResult from "../components/Dean/SearchEngineResult/SearchEngineResult"
import ThesisCollection from "../components/Dean/SearchEngineResult/ThesisCollection"


const DeanRoutes = [
    {path: '/faculty/search', exact: true, name: "Search", component: SearchEngine},
    {path: '/faculty/search=:id', exact: true, name: "SearchEngine", component: SearchEngineResult},
    {path: '/faculty/document/refid=:id', exact: true, name: "Open", component: OpenDocument},
    {path: '/faculty/accounts', exact: true, name: "Account", component: Account},
    {path: '/faculty/register', exact: true, name: "Register", component: RegisterAccount},
    {path: '/faculty/collection', exact: true, name: "Account", component: ThesisCollection},
    {path: '/faculty/import', exact: true, name: "Import", component: ImportCSV},
    {path: '/faculty/dashboard', exact: true, name: "Dash", component: Dashboard},
    {path: '/faculty/collection/refid=:id', exact: true, name: "Collection", component: DocumentDetails},
    {path: '/faculty/Logs', exact: true, name: "Logs", component: Logs},
    {path: '/faculty/message', exact: true, name: "Compose", component: Compose},
    {path: '/faculty/account', exact: true, name: "Account", component: AccountDetails},
    {path: '/faculty/inbox', exact: true, name: "Inbox", component: Inbox},
    {path: '/faculty/sent', exact: true, name: "Sent", component: Sent},
    {path: '/faculty/view/refid=:id', exact: true, name: "SentItem", component: ReadSent},
    {path: '/faculty/read/ref=:id', exact: true, name: "Read", component: ReadInbox},
]
export default DeanRoutes