
import Notes from './Notes';

export const Home = (props) => {
const {showalert}=props;
  return (
    <div>
        <Notes showalert={showalert}/>
    </div>
  )
}
export default Home;