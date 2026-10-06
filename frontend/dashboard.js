// ============================================================
// AI PRODUCT RECOMMENDATION SYSTEM
// PREMIUM ANALYTICS DASHBOARD
// ============================================================


const API_URL = "https://customer-product-recommendation-system.onrender.com";


// ============================================================
// CHART VARIABLES
// ============================================================

let purchaseChart = null;
let categoryChart = null;
let customerChart = null;
let recommendationChart = null;


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);


// ============================================================
// MAIN DASHBOARD LOADER
// ============================================================

async function loadDashboard() {

    try {

        await Promise.all([

            loadDashboardStats(),

            loadMostPurchasedProducts(),

            loadCategoryPurchases(),

            loadCustomerActivity(),

            loadTopRecommendedProducts()

        ]);

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// ============================================================
// DASHBOARD STATS
// ============================================================

async function loadDashboardStats() {

    try {

        const response =
            await fetch(
                `${API_URL}/dashboard/stats`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load dashboard statistics."
            );

        }


        const data =
            await response.json();


        document.getElementById(
            "totalCustomers"
        ).textContent =
            data.total_customers;


        document.getElementById(
            "totalProducts"
        ).textContent =
            data.total_products;


        document.getElementById(
            "totalPurchases"
        ).textContent =
            data.total_purchases;

    }

    catch (error) {

        console.error(
            "Stats error:",
            error
        );

    }

}


// ============================================================
// MOST PURCHASED PRODUCTS
// ============================================================

async function loadMostPurchasedProducts() {

    const container =
        document.getElementById(
            "mostPurchasedProducts"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/dashboard/most-purchased`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load products."
            );

        }


        const data =
            await response.json();


        const products =
            data.most_purchased_products;


        container.innerHTML = "";


        if (
            !products ||
            products.length === 0
        ) {

            container.innerHTML =
                `<div class="analytics-empty">
                    No purchase data available.
                </div>`;

            return;

        }


        products.forEach(
            (product, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "analytics-item";


                item.innerHTML = `

                    <div class="analytics-rank">
                        ${index + 1}
                    </div>

                    <div class="analytics-item-info">

                        <strong>
                            ${escapeHTML(
                                product.product_name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                product.category
                            )}
                        </span>

                    </div>

                    <div class="analytics-item-value">

                        ${product.total_quantity}

                        <span>
                            purchases
                        </span>

                    </div>

                `;


                container.appendChild(item);

            }
        );


        createPurchaseChart(products);

    }

    catch (error) {

        console.error(
            "Most purchased products error:",
            error
        );


        container.innerHTML =
            `<div class="analytics-error">
                Unable to load product data.
            </div>`;

    }

}


// ============================================================
// PURCHASE BAR CHART
// ============================================================

function createPurchaseChart(products) {

    const canvas =
        document.getElementById(
            "purchaseChart"
        );


    if (!canvas) return;


    if (purchaseChart) {

        purchaseChart.destroy();

    }


    purchaseChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        products.map(
                            product =>
                                product.product_name
                        ),

                    datasets: [

                        {

                            label:
                                "Purchase Quantity",

                            data:
                                products.map(
                                    product =>
                                        product.total_quantity
                                ),

                            borderRadius: 8,

                            backgroundColor:
                                "rgba(96, 165, 250, 0.75)",

                            borderColor:
                                "rgba(96, 165, 250, 1)",

                            borderWidth: 1

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#cbd5e1"

                            }

                        }

                    },


                    scales: {

                        x: {

                            ticks: {

                                color: "#94a3b8",

                                maxRotation: 35,

                                minRotation: 0

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.08)"

                            }

                        },


                        y: {

                            beginAtZero: true,

                            ticks: {

                                color: "#94a3b8",

                                precision: 0

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.08)"

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// CATEGORY PURCHASES
// ============================================================

async function loadCategoryPurchases() {

    const container =
        document.getElementById(
            "categoryPurchases"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/dashboard/category-purchases`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load category data."
            );

        }


        const data =
            await response.json();


        const categories =
            data.category_purchases;


        container.innerHTML = "";


        if (
            !categories ||
            categories.length === 0
        ) {

            container.innerHTML =
                `<div class="analytics-empty">
                    No category data available.
                </div>`;

            return;

        }


        const maxQuantity =
            Math.max(
                ...categories.map(
                    category =>
                        category.total_quantity
                )
            );


        categories.forEach(
            category => {

                const percentage =
                    maxQuantity > 0
                        ? (
                            category.total_quantity /
                            maxQuantity
                        ) * 100
                        : 0;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "category-item";


                item.innerHTML = `

                    <div class="category-header">

                        <strong>
                            ${escapeHTML(
                                category.category
                            )}
                        </strong>

                        <span>
                            ${category.total_quantity}
                        </span>

                    </div>


                    <div class="category-bar">

                        <div
                            class="category-bar-fill"
                            style="
                                width: ${percentage}%;
                            "
                        ></div>

                    </div>

                `;


                container.appendChild(item);

            }
        );


        createCategoryChart(categories);

    }

    catch (error) {

        console.error(
            "Category error:",
            error
        );


        container.innerHTML =
            `<div class="analytics-error">
                Unable to load category data.
            </div>`;

    }

}


// ============================================================
// CATEGORY DOUGHNUT CHART
// ============================================================

function createCategoryChart(categories) {

    const canvas =
        document.getElementById(
            "categoryChart"
        );


    if (!canvas) return;


    if (categoryChart) {

        categoryChart.destroy();

    }


    categoryChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        categories.map(
                            category =>
                                category.category
                        ),

                    datasets: [

                        {

                            data:
                                categories.map(
                                    category =>
                                        category.total_quantity
                                ),

                            backgroundColor: [

                                "#3b82f6",
                                "#8b5cf6",
                                "#06b6d4",
                                "#ec4899",
                                "#22c55e",
                                "#f59e0b"

                            ],

                            borderColor:
                                "#0f172a",

                            borderWidth: 3

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "62%",

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color: "#cbd5e1",

                                padding: 18,

                                usePointStyle: true,

                                pointStyle: "circle"

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// CUSTOMER ACTIVITY
// ============================================================

async function loadCustomerActivity() {

    const container =
        document.getElementById(
            "customerActivity"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/dashboard/customer-activity`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load customer activity."
            );

        }


        const data =
            await response.json();


        const customers =
            data.customer_activity;


        container.innerHTML = "";


        if (
            !customers ||
            customers.length === 0
        ) {

            container.innerHTML =
                `<div class="analytics-empty">
                    No customer activity available.
                </div>`;

            return;

        }


        const maxPurchases =
            Math.max(
                ...customers.map(
                    customer =>
                        customer.total_purchases
                )
            );


        customers.forEach(
            (customer, index) => {

                const percentage =
                    maxPurchases > 0
                        ? (
                            customer.total_purchases /
                            maxPurchases
                        ) * 100
                        : 0;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "customer-activity-item";


                item.innerHTML = `

                    <div class="customer-rank">
                        ${index + 1}
                    </div>


                    <div class="customer-info">

                        <strong>
                            ${escapeHTML(
                                customer.name
                            )}
                        </strong>

                        <span>
                            Customer ID:
                            ${customer.customer_id}
                        </span>

                    </div>


                    <div class="customer-progress">

                        <div class="customer-progress-bar">

                            <div
                                class="customer-progress-fill"
                                style="
                                    width: ${percentage}%;
                                "
                            ></div>

                        </div>

                    </div>


                    <div class="customer-purchases">

                        ${customer.total_purchases}

                        <span>
                            purchases
                        </span>

                    </div>

                `;


                container.appendChild(item);

            }
        );


        createCustomerChart(customers);

    }

    catch (error) {

        console.error(
            "Customer activity error:",
            error
        );


        container.innerHTML =
            `<div class="analytics-error">
                Unable to load customer activity.
            </div>`;

    }

}


// ============================================================
// CUSTOMER BAR CHART
// ============================================================

function createCustomerChart(customers) {

    const canvas =
        document.getElementById(
            "customerChart"
        );


    if (!canvas) return;


    if (customerChart) {

        customerChart.destroy();

    }


    customerChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        customers.map(
                            customer =>
                                customer.name
                        ),

                    datasets: [

                        {

                            label:
                                "Total Purchases",

                            data:
                                customers.map(
                                    customer =>
                                        customer.total_purchases
                                ),

                            backgroundColor:
                                "rgba(139, 92, 246, 0.75)",

                            borderColor:
                                "rgba(167, 139, 250, 1)",

                            borderWidth: 1,

                            borderRadius: 8

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#cbd5e1"

                            }

                        }

                    },


                    scales: {

                        x: {

                            ticks: {

                                color: "#94a3b8"

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.08)"

                            }

                        },


                        y: {

                            beginAtZero: true,

                            ticks: {

                                color: "#94a3b8",

                                precision: 0

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.08)"

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// TOP RECOMMENDED PRODUCTS
// ============================================================

async function loadTopRecommendedProducts() {

    const container =
        document.getElementById(
            "topRecommendedProducts"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/dashboard/top-recommendations`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load recommendations."
            );

        }


        const data =
            await response.json();


        const products =
            data.top_recommended_products;


        container.innerHTML = "";


        if (
            !products ||
            products.length === 0
        ) {

            container.innerHTML =
                `<div class="analytics-empty">
                    No recommendation data available.
                </div>`;

            return;

        }


        const maxScore =
            Math.max(
                ...products.map(
                    product =>
                        product.total_recommendation_score
                )
            );


        products.forEach(
            (product, index) => {

                const percentage =
                    maxScore > 0
                        ? (
                            product.total_recommendation_score /
                            maxScore
                        ) * 100
                        : 0;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "recommendation-analytics-item";


                item.innerHTML = `

                    <div class="recommendation-rank">
                        ${index + 1}
                    </div>


                    <div class="recommendation-info">

                        <strong>
                            ${escapeHTML(
                                product.product_name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                product.category
                            )}
                        </span>

                    </div>


                    <div class="recommendation-score-area">

                        <div class="recommendation-score-bar">

                            <div
                                class="recommendation-score-fill"
                                style="
                                    width: ${percentage}%;
                                "
                            ></div>

                        </div>

                    </div>


                    <div class="recommendation-score">

                        ${Number(
                            product.total_recommendation_score
                        ).toFixed(4)}

                    </div>

                `;


                container.appendChild(item);

            }
        );


        createRecommendationChart(
            products
        );

    }

    catch (error) {

        console.error(
            "Recommendation error:",
            error
        );


        container.innerHTML =
            `<div class="analytics-error">
                Unable to load recommendation data.
            </div>`;

    }

}


// ============================================================
// RECOMMENDATION CHART
// ============================================================

function createRecommendationChart(
    products
) {

    const canvas =
        document.getElementById(
            "recommendationChart"
        );


    if (!canvas) return;


    if (recommendationChart) {

        recommendationChart.destroy();

    }


    recommendationChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels:
                        products.map(
                            product =>
                                product.product_name
                        ),

                    datasets: [

                        {

                            label:
                                "Recommendation Score",

                            data:
                                products.map(
                                    product =>
                                        Number(
                                            product.total_recommendation_score
                                        )
                                ),

                            backgroundColor:
                                "rgba(168, 85, 247, 0.75)",

                            borderColor:
                                "rgba(192, 132, 252, 1)",

                            borderWidth: 1,

                            borderRadius: 8

                        }

                    ]

                },


                options: {

                    indexAxis: "y",

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#cbd5e1"

                            }

                        }

                    },


                    scales: {

                        x: {

                            beginAtZero: true,

                            ticks: {

                                color: "#94a3b8"

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.08)"

                            }

                        },


                        y: {

                            ticks: {

                                color: "#94a3b8"

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.08)"

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// HTML SECURITY
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}