import Compose from "../components/Chairman/Message/Compose";
import Inbox from "../components/Chairman/Message/Inbox";
import SentItems from "../components/Chairman/Message/SentItems";
import Analytics from "../components/Chairman/Pages/Analytics";
import DocumentDetails from "../components/Chairman/Pages/DocumentDetails";
import SchoolYear from "../components/Chairman/Pages/SchoolYear";
import SearchEngine from "../components/Chairman/Pages/SearchEngine";
import ThesisCollection from "../components/Chairman/Pages/ThesisCollection";
import OpenDocument from "../components/Chairman/SearchResults/OpenDocument";
import Results from "../components/Chairman/SearchResults/Results";


const ChairmanRoutes = [
    {path: '/staff/search', exact: true, name: "Search", component: SearchEngine},
    {path: '/staff/collection', exact: true, name: "Collection", component: ThesisCollection},
    {path: '/staff/search=:id', exact: true, name: "SearchResults", component: Results},
    {path: '/staff/document/refid=:id', exact: true, name: "OpenResults", component: OpenDocument},
    {path: '/staff/school', exact: true, name: "School", component: SchoolYear},
    {path: '/staff/analytics', exact: true, name: "Analytics", component: Analytics},
    {path: '/staff/message', exact: true, name: "Compose", component: Compose},
    {path: '/staff/inbox', exact: true, name: "Inbox", component: Inbox},
    {path: '/staff/sent', exact: true, name: "SentItems", component: SentItems},
    {path: '/staff/collection/refid=:id', exact: true, name: "Details", component: DocumentDetails},
]

export default ChairmanRoutes;