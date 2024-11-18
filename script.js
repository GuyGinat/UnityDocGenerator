document.addEventListener("DOMContentLoaded", function () {
    let classesData = []; // Variable to store all classes data

    fetch("methods.json")
        .then(response => response.json())
        .then(data => {
            classesData = data.classes; // Save data to use in the filter
            renderClasses(classesData); // Initial render
        })
        .catch(error => {
            console.error("Error loading JSON data:", error);
        });

    // Function to render classes and methods
    function renderClasses(classes) {
        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = ""; // Clear previous content

        const namespaces = {};
        classes.forEach(cls => {
            if (!namespaces[cls.namespace]) {
                namespaces[cls.namespace] = [];
            }
            namespaces[cls.namespace].push(cls);
        });

        // Display namespaces with nested class dropdowns
        Object.keys(namespaces).forEach(namespace => {
            const namespaceDiv = document.createElement("div");
            namespaceDiv.classList.add("namespace");

            const namespaceTitle = document.createElement("h2");
            namespaceTitle.textContent = `Namespace: ${namespace}`;
            namespaceTitle.addEventListener("click", () => {
                namespaceClasses.classList.toggle("hidden");
            });
            namespaceDiv.appendChild(namespaceTitle);

            const namespaceClasses = document.createElement("div");
            namespaceClasses.classList.add("namespace-classes", "hidden");

            namespaces[namespace].forEach(cls => {
                const classDiv = document.createElement("div");
                classDiv.classList.add("class");

                const classTitle = document.createElement("h3");
                classTitle.textContent = `Class: ${cls.className}`;
                classTitle.addEventListener("click", () => {
                    methodsContainer.classList.toggle("hidden");
                });
                classDiv.appendChild(classTitle);

                const methodsContainer = document.createElement("div");
                methodsContainer.classList.add("methods-container", "hidden");

                cls.methods.forEach(method => {
                    const methodDiv = document.createElement("div");
                    methodDiv.classList.add("method");

                    const methodTitle = document.createElement("div");
                    methodTitle.classList.add("method-title");
                    methodTitle.textContent = method.methodName;
                    methodDiv.appendChild(methodTitle);

                    const methodDetails = document.createElement("div");
                    methodDetails.classList.add("method-details");

                    const returnType = document.createElement("div");
                    returnType.classList.add("return-type");
                    returnType.innerHTML = `<strong>Return Type:</strong> ${method.returnType}`;
                    methodDetails.appendChild(returnType);

                    const parameters = document.createElement("div");
                    parameters.classList.add("parameters");
                    parameters.innerHTML = `<strong>Parameters:</strong> ${method.parameters || "None"}`;
                    methodDetails.appendChild(parameters);

                    methodDiv.appendChild(methodDetails);
                    methodsContainer.appendChild(methodDiv);
                });

                classDiv.appendChild(methodsContainer);
                namespaceClasses.appendChild(classDiv);
            });

            namespaceDiv.appendChild(namespaceClasses);
            contentDiv.appendChild(namespaceDiv);
        });
    }

    function applySearchFilter() {
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    
        // Filter classes and methods based on the search term
        const filteredClasses = classesData
            .map(cls => {
                // Filter methods within each class that match the search term
                const matchingMethods = cls.methods.filter(method =>
                    method.methodName.toLowerCase().includes(searchTerm)
                );
    
                // Check if the class name itself matches the search term or has matching methods
                const classNameMatch = cls.className.toLowerCase().includes(searchTerm);
    
                // Return the class with filtered methods if there is a match
                if (classNameMatch || matchingMethods.length > 0) {
                    return {
                        ...cls,
                        methods: matchingMethods // Only include matching methods
                    };
                }
    
                return null; // Exclude classes with no matches
            })
            .filter(cls => cls !== null); // Remove null entries for classes with no matches
    
        renderClasses(filteredClasses); // Re-render with filtered data
    }
    

    function renderNamespaces(namespaces, parentElement = document.getElementById("content")) {
        parentElement.innerHTML = ""; // Clear previous content
    
        Object.keys(namespaces).forEach(namespaceName => {
            const namespaceData = namespaces[namespaceName];
            const namespaceDiv = document.createElement("div");
            namespaceDiv.classList.add("namespace");
    
            const namespaceTitle = document.createElement("h2");
            namespaceTitle.textContent = `Namespace: ${namespaceName}`;
            namespaceTitle.addEventListener("click", () => {
                namespaceContent.classList.toggle("hidden");
            });
            namespaceDiv.appendChild(namespaceTitle);
    
            const namespaceContent = document.createElement("div");
            namespaceContent.classList.add("namespace-content", "hidden");
    
            // Render classes in this namespace
            namespaceData._classes.forEach(cls => {
                const classDiv = document.createElement("div");
                classDiv.classList.add("class");
    
                const classTitle = document.createElement("h3");
                classTitle.textContent = `Class: ${cls.className}`;
                classTitle.addEventListener("click", () => {
                    methodsContainer.classList.toggle("hidden");
                });
                classDiv.appendChild(classTitle);
    
                const methodsContainer = document.createElement("div");
                methodsContainer.classList.add("methods-container", "hidden");
    
                cls.methods.forEach(method => {
                    const methodDiv = document.createElement("div");
                    methodDiv.classList.add("method");
    
                    const methodTitle = document.createElement("div");
                    methodTitle.classList.add("method-title");
                    methodTitle.textContent = method.methodName;
                    methodDiv.appendChild(methodTitle);
    
                    const methodDetails = document.createElement("div");
                    methodDetails.classList.add("method-details");
    
                    const returnType = document.createElement("div");
                    returnType.classList.add("return-type");
                    returnType.innerHTML = `<strong>Return Type:</strong> ${method.returnType}`;
                    methodDetails.appendChild(returnType);
    
                    const parameters = document.createElement("div");
                    parameters.classList.add("parameters");
                    parameters.innerHTML = `<strong>Parameters:</strong> ${method.parameters || "None"}`;
                    methodDetails.appendChild(parameters);
    
                    methodDiv.appendChild(methodDetails);
                    methodsContainer.appendChild(methodDiv);
                });
    
                classDiv.appendChild(methodsContainer);
                namespaceContent.appendChild(classDiv);
            });
    
            // Recursively render nested namespaces
            renderNamespaces(namespaceData, namespaceContent);
    
            namespaceDiv.appendChild(namespaceContent);
            parentElement.appendChild(namespaceDiv);
        });
    }
    

    // Event listener for Enter key in the search input
    document.getElementById("searchInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            applySearchFilter();
        }
    });

    // Event listener for search button click
    document.getElementById("searchButton").addEventListener("click", applySearchFilter);
});
