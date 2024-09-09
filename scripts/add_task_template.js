function openSelect() {
    return `<div class="assigned-container">
              <input
                class="placeholder-black"
                type="text"
                placeholder="Select contacts to assign"
                id="assigned_to"
              />
              <div class="hover-circle d-flex-center pos-abs">
                <img
                  onclick="openSelect()"
                  src="../assets/img/png-old/arrow_drop_down.png"
                  alt=""
                />
              </div>
            </div>`
}