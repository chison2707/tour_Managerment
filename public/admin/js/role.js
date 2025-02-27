// permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("[data-name]");

        rows.forEach((row) => {
            const name = row.getAttribute("data-name");
            const ipnputs = row.querySelectorAll("input");

            if (name == "id") {
                ipnputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                })
            } else {
                ipnputs.forEach((input, index) => {
                    const checked = input.checked;

                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });
        console.log(permissions);

        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");

            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        }
    })
};
// end permissions

// permissions data default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");
    records.forEach((record, index) => {
        const permissions = JSON.parse(record.permissions || "[]");

        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row?.querySelectorAll("input")[index];
            input && (input.checked = true);
        });
    });

}
// end permissions data default