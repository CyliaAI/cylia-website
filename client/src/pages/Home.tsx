import Layout from "../components/Layout/Layout"
import { UploadBox } from "../utils/UploadBox"
const Home = () => {
  return (
    <Layout>
        <div>Home
          <UploadBox uploadUrl="http://localhost:8000/upload" />
        </div>
    </Layout>
  )
}

export default Home