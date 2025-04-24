import React, { useEffect, useState } from "react";
import { Card, Button, ProgressBar, Badge } from "react-bootstrap";
import { ChartPie, Users, Heart, FileText } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Title, Tooltip, Legend } from 'chart.js';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust path if needed

// Registering necessary components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample Data (Can be fetched from an API later)
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch donors
        const donorsSnap = await getDocs(collection(db, "donors"));
        const donorCount = donorsSnap.size;

        // Fetch patients
        const patientsSnap = await getDocs(collection(db, "patients"));
        const patientCount = patientsSnap.size;

        setTotalUsers(donorCount + patientCount);

        // Fetch donations
        const donationsSnap = await getDocs(collection(db, "medicineDonations"));
        setTotalDonations(donationsSnap.size);

        // Fetch requests
        const requestsSnap = await getDocs(collection(db, "PatientRequests"));
        setTotalRequests(requestsSnap.size);

        // Count completed requests
        const completed = requestsSnap.docs.filter(doc => doc.data().status === "Completed").length;
        setCompletedRequests(completed);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const completionRate = totalRequests > 0
    ? Math.round((completedRequests / totalRequests) * 100)
    : 0;

  // Dummy data for Donations Trend
  const donationsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Total Donations",
        data: [20, 40, 30, 50, 60, 80, 100],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Dummy data for Requests Trend
  const requestsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Total Requests",
        data: [10, 15, 20, 25, 30, 35, 40],
        fill: true,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="container">
      {/* Statistics Cards */}
      <div className="row my-5 ">
        <div className="col-md-4 mb-3">
          <Card className="text-center shadow-sm border-primary">
            <Card.Body>
              <Users size={32} className="mb-2 text-primary" />
              <Card.Title>Total Users</Card.Title>
              <Card.Text>
                <h4>
                  <Badge bg="primary">{totalUsers}</Badge>
                </h4>
              </Card.Text>
              <Button
                variant="outline-primary"
                onClick={() => navigate("/users")}
              >
                View Users
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 mb-3">
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <Heart size={32} className="mb-2 text-success" />
              <Card.Title>Total Donations</Card.Title>
              <Card.Text>
                <h4>
                  <Badge bg="success">{totalDonations}</Badge>
                </h4>
              </Card.Text>
              <Button
                variant="outline-success"
                onClick={() => navigate("/donations")}
              >
                View Donations
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 mb-3">
          <Card className="text-center shadow-sm border-danger">
            <Card.Body>
              <FileText size={32} className="mb-2 text-danger" />
              <Card.Title>Total Requests</Card.Title>
              <Card.Text>
                <h4>
                  <Badge bg="danger">{totalRequests}</Badge>
                </h4>
              </Card.Text>
              <Button
                variant="outline-danger"
                onClick={() => navigate("/requests")}
              >
                View Requests
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Progress Bar for Request Completion */}
      <div className="mt-4">
        <h5>Requests Completion Rate</h5>
        <ProgressBar
          animated
          now={completionRate}
          label={`${completionRate}%`}
          variant="info"
          style={{ height: "30px" }}
        />
      </div>

      {/* Charts Section */}
      <div className="mt-5">
        <h3>Activity Overview</h3>
        <div className="row">
          <div className="col-md-6">
            <Card className="shadow-sm">
              <Card.Header>
                <ChartPie size={24} /> Donations Trend
              </Card.Header>
              <Card.Body>
                <Line data={donationsData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Donations Over Time',
                    },
                  },
                }} />
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-6">
            <Card className="shadow-sm">
              <Card.Header>
                <ChartPie size={24} /> Requests Trend
              </Card.Header>
              <Card.Body>
                <Line data={requestsData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Requests Over Time',
                    },
                  },
                }} />
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
