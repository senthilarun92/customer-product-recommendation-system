// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://127.0.0.1:8000";


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardStats();

    }
);


// =========================================================
// LOAD DASHBOARD STATISTICS
// =========================================================

async function loadDashboardStats() {

    try {

        const response = await fetch(
            `${API_URL}/dashboard/stats`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load dashboard statistics."
            );

        }


        const stats = await response.json();


        // -------------------------------------------------
        // Display Total Customers
        // -------------------------------------------------

        document.getElementById(
            "totalCustomers"
        ).innerText =
            stats.total_customers;


        // -------------------------------------------------
        // Display Total Products
        // -------------------------------------------------

        document.getElementById(
            "totalProducts"
        ).innerText =
            stats.total_products;


        // -------------------------------------------------
        // Display Total Purchases
        // -------------------------------------------------

        document.getElementById(
            "totalPurchases"
        ).innerText =
            stats.total_purchases;


    }

    catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );


        document.getElementById(
            "totalCustomers"
        ).innerText = "0";


        document.getElementById(
            "totalProducts"
        ).innerText = "0";


        document.getElementById(
            "totalPurchases"
        ).innerText = "0";

    }

}


// =========================================================
// GET CUSTOMER RECOMMENDATIONS
// =========================================================

async function getRecommendations() {

    const customerIdInput =
        document.getElementById(
            "customerId"
        );


    const customerId =
        customerIdInput.value.trim();


    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    const recommendationsContainer =
        document.getElementById(
            "recommendations"
        );


    // -----------------------------------------------------
    // Clear Previous Error
    // -----------------------------------------------------

    errorMessage.innerText = "";


    // -----------------------------------------------------
    // Validate Customer ID
    // -----------------------------------------------------

    if (!customerId) {

        errorMessage.innerText =
            "Please enter a customer ID.";

        return;

    }


    // -----------------------------------------------------
    // Show Loading
    // -----------------------------------------------------

    recommendationsContainer.innerHTML = `

        <div class="loading">

            Loading customer information
            and recommendations...

        </div>

    `;


    try {

        // -------------------------------------------------
        // Call Three APIs
        // -------------------------------------------------

        const [

            profileResponse,

            recommendationResponse,

            historyResponse

        ] = await Promise.all([

            fetch(
                `${API_URL}/customer/${customerId}`
            ),

            fetch(
                `${API_URL}/recommend/${customerId}?top_n=5`
            ),

            fetch(
                `${API_URL}/customer/${customerId}/history`
            )

        ]);


        // -------------------------------------------------
        // Check Profile Response
        // -------------------------------------------------

        if (!profileResponse.ok) {

            throw new Error(
                "Customer not found."
            );

        }


        // -------------------------------------------------
        // Check Recommendation Response
        // -------------------------------------------------

        if (!recommendationResponse.ok) {

            throw new Error(
                "Unable to generate recommendations."
            );

        }


        // -------------------------------------------------
        // Convert Responses to JSON
        // -------------------------------------------------

        const profile =
            await profileResponse.json();


        const recommendationData =
            await recommendationResponse.json();


        let historyData = null;


        // Purchase history may fail independently
        // -------------------------------------------------

        if (historyResponse.ok) {

            historyData =
                await historyResponse.json();

        }


        // -------------------------------------------------
        // Display Customer Profile
        // -------------------------------------------------

        displayCustomerProfile(
            profile
        );


        // -------------------------------------------------
        // Display Customer Summary
        // -------------------------------------------------

        displayCustomerSummary(
            profile,
            recommendationData
        );


        // -------------------------------------------------
        // Display Purchase History
        // -------------------------------------------------

        if (historyData) {

            displayPurchaseHistory(
                historyData
            );

        }

        else {

            hidePurchaseHistory();

        }


        // -------------------------------------------------
        // Display Recommendations
        // -------------------------------------------------

        displayRecommendations(
            recommendationData
        );


    }

    catch (error) {

        console.error(
            "Recommendation error:",
            error
        );


        errorMessage.innerText =
            error.message ||
            "Something went wrong.";


        recommendationsContainer.innerHTML = "";

        hideCustomerProfile();

        hideCustomerSummary();

        hidePurchaseHistory();

    }

}


// =========================================================
// DISPLAY CUSTOMER PROFILE
// =========================================================

function displayCustomerProfile(
    profile
) {

    document.getElementById(
        "customerProfile"
    ).style.display = "block";


    document.getElementById(
        "profileName"
    ).innerText =
        profile.name;


    document.getElementById(
        "profileCustomerId"
    ).innerText =
        profile.customer_id;


    document.getElementById(
        "profileNameDetail"
    ).innerText =
        profile.name;


    document.getElementById(
        "profileAge"
    ).innerText =
        profile.age;


    document.getElementById(
        "profileCity"
    ).innerText =
        profile.city;

}


// =========================================================
// HIDE CUSTOMER PROFILE
// =========================================================

function hideCustomerProfile() {

    document.getElementById(
        "customerProfile"
    ).style.display = "none";

}


// =========================================================
// DISPLAY CUSTOMER SUMMARY
// =========================================================

function displayCustomerSummary(
    profile,
    recommendationData
) {

    const recommendations =
        recommendationData.recommendations;


    document.getElementById(
        "customerSummary"
    ).style.display = "grid";


    document.getElementById(
        "summaryCustomer"
    ).innerText =
        profile.name;


    document.getElementById(
        "summaryRecommendations"
    ).innerText =
        recommendations.length;


    if (recommendations.length > 0) {

        document.getElementById(
            "summaryTopProduct"
        ).innerText =
            recommendations[0].product_name;

    }

    else {

        document.getElementById(
            "summaryTopProduct"
        ).innerText =
            "No recommendation";

    }

}


// =========================================================
// HIDE CUSTOMER SUMMARY
// =========================================================

function hideCustomerSummary() {

    document.getElementById(
        "customerSummary"
    ).style.display = "none";

}


// =========================================================
// DISPLAY PURCHASE HISTORY
// =========================================================

function displayPurchaseHistory(
    historyData
) {

    const section =
        document.getElementById(
            "purchaseHistorySection"
        );


    const container =
        document.getElementById(
            "purchaseHistory"
        );


    const history =
        historyData.purchase_history;


    section.style.display = "block";


    container.innerHTML = "";


    document.getElementById(
        "purchaseHistoryInfo"
    ).innerText =

        `${history.length} previous purchase(s) found for this customer.`;


    // -----------------------------------------------------
    // Create History Cards
    // -----------------------------------------------------

    history.forEach(
        function (item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "purchase-history-card";


            card.innerHTML = `

                <div class="purchase-icon">
                    🛒
                </div>


                <div class="purchase-info">

                    <h3>
                        ${item.product_name}
                    </h3>


                    <span>
                        ${item.category}
                    </span>


                    <p>
                        ₹${formatPrice(item.price)}
                    </p>

                </div>


                <div class="purchase-meta">

                    <span>
                        ⭐ ${item.rating}
                    </span>


                    <span>
                        ${formatDate(item.purchase_date)}
                    </span>


                    <span>
                        Qty: ${item.quantity}
                    </span>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =========================================================
// HIDE PURCHASE HISTORY
// =========================================================

function hidePurchaseHistory() {

    document.getElementById(
        "purchaseHistorySection"
    ).style.display = "none";


    document.getElementById(
        "purchaseHistory"
    ).innerHTML = "";

}


// =========================================================
// DISPLAY RECOMMENDATIONS
// =========================================================

function displayRecommendations(
    recommendationData
) {

    const container =
        document.getElementById(
            "recommendations"
        );


    const customerInfo =
        document.getElementById(
            "customerInfo"
        );


    const recommendations =
        recommendationData.recommendations;


    container.innerHTML = "";


    // -----------------------------------------------------
    // Update Customer Information
    // -----------------------------------------------------

    customerInfo.innerText =

        `Personalized recommendations for Customer ${recommendationData.customer_id}`;


    // -----------------------------------------------------
    // No Recommendations
    // -----------------------------------------------------

    if (
        !recommendations ||
        recommendations.length === 0
    ) {

        container.innerHTML = `

            <div class="loading">

                No recommendations available.

            </div>

        `;

        return;

    }


    // -----------------------------------------------------
    // Find Maximum Score
    // -----------------------------------------------------

    const maxScore =
        Math.max(
            ...recommendations.map(
                item =>
                    item.recommendation_score
            )
        );


    // -----------------------------------------------------
    // Create Recommendation Cards
    // -----------------------------------------------------

    recommendations.forEach(
        function (product, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            // ---------------------------------------------
            // Calculate Score Percentage
            // ---------------------------------------------

            let scorePercentage = 0;


            if (maxScore > 0) {

                scorePercentage =
                    (
                        product.recommendation_score /
                        maxScore
                    ) * 100;

            }


            // ---------------------------------------------
            // Create Card
            // ---------------------------------------------

            card.innerHTML = `

                <div class="product-rank">

                    #${index + 1}

                </div>


                <div class="product-icon">

                    🛍️

                </div>


                <h3>

                    ${product.product_name}

                </h3>


                <span class="product-category">

                    ${product.category}

                </span>


                <div class="product-price">

                    ₹${formatPrice(product.price)}

                </div>


                <div class="recommendation-score">

                    <div class="score-header">

                        <span>
                            Recommendation Score
                        </span>

                        <strong>
                            ${product.recommendation_score}
                        </strong>

                    </div>


                    <div class="score-bar">

                        <div
                            class="score-fill"
                            style="width: ${scorePercentage}%"
                        ></div>

                    </div>

                </div>


                    <p class="recommendation-explanation">

                💡  <strong>Why recommended?</strong><br>

                        Customers with similar purchase behavior
                        also purchased this product.

                    </p>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =========================================================
// FORMAT PRICE
// =========================================================

function formatPrice(
    price
) {

    return Number(
        price
    ).toLocaleString(
        "en-IN"
    );

}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    const month =
        getMonthName(
            date.getMonth()
        );


    const year =
        date.getFullYear();


    return `${day} ${month} ${year}`;

}


// =========================================================
// MONTH NAME
// =========================================================

function getMonthName(
    monthIndex
) {

    const months = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];


    return months[
        monthIndex
    ];

}


// =========================================================
// ENTER KEY SUPPORT
// =========================================================

document
    .getElementById("customerId")
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                getRecommendations();

            }

        }
    );