
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // <-- Import required firestore functions
import { firebaseApp } from '../firebase/firebaseConfig';

const Orders = () => {
    const db = getFirestore(firebaseApp);
    const [orders, setOrders] = useState([]);
    const [riders, setRiders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'orders'));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        const fetchRiders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'riders'));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setRiders(data);
            } catch (error) {
                console.error('Error fetching riders:', error);
            }
        };

        fetchOrders();
        fetchRiders();
    }, []);

    const handleViewDetails = (order) => {
        setSelectedOrder(order); // Set the selected order to display its details
    };

    return (
        <div className="container mt-4">
            <h2>Approved Orders</h2>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Order ID</th>
                            <th>Patient</th>
                            <th>Medicine</th>
                            <th>Quantity</th>
                            <th>Priority</th>
                            <th>Delivery</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th> {/* Add Actions column for the button */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.patientName}</td>
                                <td>{order.medicineName}</td>
                                <td>{order.quantity}</td>
                                <td>{order.priority}</td>
                                <td>{order.deliveryMethod}</td>
                                <td>
                                    <span className="badge bg-success">{order.status}</span>
                                </td>
                                <td>
                                    {order.orderCreatedAt?.seconds
                                        ? new Date(order.orderCreatedAt.seconds * 1000).toLocaleString()
                                        : '—'}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => handleViewDetails(order)} // On button click, view order details
                                    >
                                        More Info
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Conditional rendering for the selected order details */}
            {selectedOrder && (
                <div className="order-details mt-4">
                    <h4>Order Details</h4>
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Patient Name:</strong> {selectedOrder.patientName}</p>
                    <p><strong>Patient Email:</strong> {selectedOrder.patientEmail}</p>
                    <p><strong>Patient Mobile:</strong> {selectedOrder.patientMobile}</p>
                    <p><strong>Patient Address:</strong> {selectedOrder.patientAddress}</p>
                    <p><strong>Medicine:</strong> {selectedOrder.medicineName}</p>
                    <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                    <p><strong>Priority:</strong> {selectedOrder.priority}</p>
                    <p><strong>Status:</strong> {selectedOrder.status}</p>
                    <p><strong>Requested By:</strong> {selectedOrder.requestedBy}</p>
                    <p><strong>Requested At:</strong> {new Date(selectedOrder.requestedAt.seconds * 1000).toLocaleString()}</p>
                    <p><strong>Order Created At:</strong> {new Date(selectedOrder.orderCreatedAt.seconds * 1000).toLocaleString()}</p>
                    <p><strong>Delivery Method:</strong> {selectedOrder.deliveryMethod}</p>
                    <p><strong>Donor Name:</strong> {selectedOrder.donorName}</p>
                </div>
            )}
        </div>
    );
};

export default Orders;
