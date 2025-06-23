import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
function Home() {
  
  const [exams, setExams] = React.useState([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
    console.log(user)
  }, []);

  return (
    user && (
      <div>
        <PageTitle title={`Hi ${user.name}, Welcome to Quiz Application`} />
        <div className="divider "></div>
        <Row gutter={[16, 16]}>
          {exams.map((exam) => (
            <Col span={6}>
              <div className=" bg-white card-lg flex flex-col gap-1 p-2 rounded-lg shadow-4xl m-5 ">
                <h1 className="text-2xl font-bold">{exam?.name}</h1>

                <h1 className="text-md">Category : {exam.category}</h1>
                <h1 className="text-md">Total Marks : {exam.totalMarks}</h1>
                <h1 className="text-md">Passing Marks : {exam.passingMarks}</h1>
                <h1 className="text-md">Duration : {exam.duration}</h1>

                <button
                  className="primary-outlined-btn rounded hover:scale-105 transition-all duration-300"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Exam
                </button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Home;
