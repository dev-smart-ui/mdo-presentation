import {stepFormState} from "./packages-modules.js";
import {licencesSelect, optionsPackageSelect} from "./request-invoice.js";
import {clearContactInputs, resetFormElements, validateContactForm, validateEmailContact} from "./validation-form.js";
import {pageSlider} from "./sliders.js";

//determine segments and modules
function findSegmentById(segments, name) {
    return segments.find(s => s.name === name);
}


function getServicesFromSelectedSegments(segments, allServices, currentPackage) {
    let result = [];
    let seenNames = new Set();
    console.log(currentPackage);

    let selectedServices = new Set();
    segments.forEach(segment => {
        segment.services.forEach(serviceName => {
            selectedServices.add(serviceName);
        });
    });

    allServices.forEach(serviceItem => {
        if (selectedServices.has(serviceItem.name) && !seenNames.has(serviceItem.name)) {
            seenNames.add(serviceItem.name);

            let isChecked = currentPackage === "Custom Package" || currentPackage === "Ultimate Package" || (currentPackage === "Research Package" && serviceItem.name === "Research Package");
            result.push(createServiceItem(serviceItem, isChecked));
        }
    });

    return result;
}


function getAvailableServices(allServices, suggestedServices, currentPackage) {
    let result = [];
    const suggestedServicesNames = new Set(suggestedServices.map(service => service.name));
    allServices.forEach(service => {
        if (!suggestedServicesNames.has(service.name)) {
            result.push(createServiceItem(service, currentPackage === "Ultimate Package"));
        }
    });
    return result;
}

function createServiceItem(service, checked) {
    return {
        name: service.name,
        price: service.price,
        iconImg: service.iconImg,
        img: service.img,
        overviewDescription: service.overviewDescription,
        checked: checked,
        serviceTabs: service.serviceTabs,
        video: service.video
    };
}


function determineDefaultState(allTargetSegments, allServices, chooseSegments) {
    let result = '';
    for (let allTargetSegment of allTargetSegments) {

        if (chooseSegments.length > 1) {
            result = "Research Package";
        }

        if (chooseSegments.includes(allTargetSegment.name)) {
            result = allTargetSegment.defaultSelected;
        }
    }

    return result;
}

//

//show modals

$(document).ready(function () {
    $("#packageSelectInfo").click(function () {
        $("#modalPackageSelectInfoText").css("display", "flex").hide().fadeIn(500);
        $("#bgOpacityInner").addClass("bg-opacity-inner-open backdrop-blur-sm");
    });

    function closeModal() {
        $("#modalPackageSelectInfoText").fadeOut(500, function () {
            $(this).css("display", "none");
        });

        $("#bgOpacityInner").removeClass("bg-opacity-inner-open backdrop-blur-sm");
    }

    $(".modal-select-info-close").click(function () {
        closeModal();
    });


    $(window).click(function (event) {
        if ($(event.target).hasClass('modal-select-info-text')) {
            closeModal();
        }
    });
});

$(document).ready(function () {
    function closeModal() {
        $("#modalSuccessful").fadeOut(500, function () {
            $(this).css("display", "none");
        });
    }

    $(".modal-successful-close").click(function () {
        closeModal();
    });


    $(window).click(function (event) {
        if ($(event.target).hasClass('modal-successful')) {
            closeModal();
        }
    });
});
$(document).ready(function () {
    $("[data-request-demo]").click(function () {
        $("#modalDemo").css("display", "flex").hide().fadeIn(500);
        $("#bgOpacityInner").addClass("bg-opacity-inner-open backdrop-blur-sm");
    });

    function closeModal() {
        $("#modalDemo").fadeOut(500, function () {
            $(this).css("display", "none");
            $("#bgOpacityInner").removeClass("bg-opacity-inner-open backdrop-blur-sm");
        });
    }

    $(".modal-demo-content-close").click(function () {
        closeModal();
    });

    $("#sendMessageBtn").click(function () {
        const isValidForm = validateContactForm();
        const isValidEmail = validateEmailContact();

        if (isValidForm && isValidEmail) {
            clearContactInputs();
            closeModal();
            pageSlider.slideTo(0);
            resetForm();
        }
    });

    $(window).click(function (event) {
        if ($(event.target).hasClass('modal-demo')) {
            closeModal();
        }
    });
});

$(document).ready(function () {
    function closeModal() {
        let $videoIframe = $('#modalVideo iframe');
        let iframeSrc = $videoIframe.attr('src');
        $videoIframe.attr('src', '');
        $videoIframe.attr('src', iframeSrc);

        $("#modalVideo").fadeOut(500, function () {
            $(this).css("display", "none");
        });
        $("#bgOpacityInner").removeClass("bg-opacity-inner-open backdrop-blur-sm");
    }

    $(".modal-demo-content-close").click(function () {
        closeModal();
    });


    $(window).click(function (event) {
        if ($(event.target).hasClass('modal-video')) {
            closeModal();
        }
    });
});

$(document).ready(function () {
    $("#termsOfUseOpen").click(function () {
        $("#termsOfUseModal").css("display", "flex").hide().fadeIn(500);
        $("#bgOpacityInner").addClass("bg-opacity-inner-open backdrop-blur-sm");
    });

    function closeModal() {
        $("#termsOfUseModal").fadeOut(500, function () {
            $(this).css("display", "none");
        });
        $("#bgOpacityInner").removeClass("bg-opacity-inner-open backdrop-blur-sm");
    }

    $("#termsOfUseClose").click(function () {
        closeModal();
    });


    $(window).click(function (event) {
        if ($(event.target).hasClass('modal-terms-of-use-box')) {
            closeModal();
        }
    });
});

function changePackageSelect(data) {
    let allChecked = true;
    let isOnlyResearchPackage = true;
    let checkedCount = 0;

    data.suggestedServices.forEach(service => {
        if (service.name === "Research Package") {
            if (!service.checked) {
                isOnlyResearchPackage = false;
            }
        } else {
            if (service.checked) {
                isOnlyResearchPackage = false;
            }
        }

        if (service.checked) {
            checkedCount++;
        } else {
            allChecked = false;
        }
    });


    data.availableServices.forEach(service => {
        if (service.checked) {
            isOnlyResearchPackage = false;
            checkedCount++;
        } else {
            allChecked = false;
        }
    });


    if (isOnlyResearchPackage) {
        optionsPackageSelect.setChoiceByValue('Research Package');
        stepFormState.currentPackageSelected = "Research Package";
        addCustomClassToChoice("Research Package");
    } else if (allChecked) {
        optionsPackageSelect.setChoiceByValue('Ultimate Package');
        stepFormState.currentPackageSelected = "Ultimate Package";
        addCustomClassToChoice("Ultimate Package");
    } else if (checkedCount > 1) {
        optionsPackageSelect.setChoiceByValue('Custom Package');
        stepFormState.currentPackageSelected = "Custom Package";
        addCustomClassToChoice("Custom Package");
    }
}

function addCustomClassToChoice(value) {
    const highlightedEl = document.querySelector('.is-highlighted');
    highlightedEl.classList.remove("is-highlighted");
    const choiceEl = document.querySelector(`.choices__list--dropdown [data-value="${value}"]`);
    if (choiceEl) {
        choiceEl.classList.add('is-highlighted');
    }
}


//

function dropdownTogglePanel(accordionPanelId) {
    const dropdownToggleList = document.querySelectorAll(".toggle-container");
    dropdownToggleList.forEach(dropdownToggle => {

        dropdownToggle.addEventListener('click', (event) => {

            const dropDownButton = event.target.closest('.dropdown-toggle') || event.target.closest('.toggle-container') || event.target.closest('.dropdown-toggle-arrow') || event.target.closest('.presentation-modules-item');
            const dropdownBox = dropDownButton.closest('.dropdown-box');
            if (dropdownBox) {

                const root = document.getElementById(`${accordionPanelId}`);

                document.querySelectorAll('.dropdown-box').forEach(box => {
                    const drop = box.querySelector('.dropdown-menu');
                    if (box === dropdownBox) {
                        box.classList.remove('closing');
                        box.classList.add('drop-down-item-open');

                        if (drop) {
                            const dropHeight = drop.scrollHeight;
                            drop.style.maxHeight = `${dropHeight}px`;
                        }

                        setTimeout(() => {
                            if (root.scrollTop > box.offsetTop - 90) { // if the drop is outside of overflow
                                const scrollVal = root.scrollTop - (root.scrollTop - box.offsetTop);

                                root.scrollTo({top: scrollVal, behavior: "smooth"});
                            }
                        }, 400);
                    } else {
                        box.classList.add('closing');

                        drop && drop.removeAttribute('style');
                        setTimeout(() => {
                            box.classList.remove('drop-down-item-open');
                        }, 10);
                    }
                });
            }
        });
    });

}


function showModulePanel(currentTab, presentationMenuId, accordionId) {
    const currentItemForOpenById = currentTab;
    const boxPanel = document.getElementById(`${presentationMenuId}`);
    const currentAccordion = document.getElementById(`${accordionId}`);

    if (currentItemForOpenById) {

        const defaultElement = currentAccordion.querySelector(`[data-tab-item="${currentItemForOpenById}"]`);
        const tabModulesItem = boxPanel && boxPanel.querySelector(`[data-tab-modules-item="${currentItemForOpenById}"]`);
        if (defaultElement) {

            defaultElement.classList.add('drop-down-item-open');
            tabModulesItem && tabModulesItem.classList.add('presentation-modules-item-active');
            const drop = defaultElement.querySelector('.dropdown-menu');
            if (drop) {
                const dropHeight = drop.scrollHeight;
                setTimeout(() => {
                    drop.style.maxHeight = `${dropHeight}px`;
                }, 500);
            }
        }
    }
}

function calculateTotalCost(store) {
    let total = 0;
    console.log(store);
    const licensesValue = store.currentLicencesSelected;
    const isGlobalSelected = store.regionsArr.includes("Global");
    const basePercent = 10; // Percentage for regions and licenses
    let basePriceValue = 0;


    //get basePriceValue
    store.suggestedServices.forEach(service => {
        if (service.checked) {
            basePriceValue += service.price;
        }
    });

    store.availableServices.forEach(service => {
        if (service.checked) {
            basePriceValue += service.price;
        }
    });

    total += basePriceValue;


    const selectedRegionCount = isGlobalSelected ? basePercent : store.regionsArr.length;
    const additionalRegionCost = selectedRegionCount * basePercent / 100 * basePriceValue;
    total += additionalRegionCost;

    const licenceFormatted = parseInt(licensesValue);
    const licensesCount = licenceFormatted > 1 ? licenceFormatted - 1 : 0;
    const additionalLicenseCost = licensesCount * basePercent / 100 * basePriceValue;

    total += additionalLicenseCost;

    store.totalCost = total;
    updateTotalCount(stepFormState);
}

function updateTotalCount(store) {
    const allTotalCounters = document.querySelectorAll('[data-total-counter-box]');
    allTotalCounters.forEach(totalCounter => {
        totalCounter.innerText = store.totalCost;
    });
}

function resetRegions() {

    const selectedItems = document.getElementById('selectedItems');
    selectedItems.textContent = 'Global';

    const checkboxes = document.querySelectorAll('[data-regions-input]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentNode.classList.remove("choose");
    });

    const globalCheckbox = document.querySelector('input[name="Global"]');
    if (globalCheckbox) {
        globalCheckbox.checked = true;
        globalCheckbox.parentNode.classList.add("choose");
    }
}

function resetForm() {
    const additionalTextOptionsSelect = document.getElementById("additionalTextOptionsSelect");
    // Reset form and formData for demonstration purposes

    clearObject(stepFormState);
    optionsPackageSelect.setChoiceByValue('Custom Package');
    stepFormState.currentPackageSelected = "Custom Package";
    addCustomClassToChoice("Custom Package");
    licencesSelect.setChoiceByValue('1');
    resetRegions();
    additionalTextOptionsSelect.innerHTML = "";
    resetFormElements();
    clearSegmentsList();

}

function clearObject(obj) {
    obj.selectedSegmentNames = [];
    obj.suggestedServices = [];
    obj.availableServices = [];
    obj.regionsArr = ["Global"];
    obj.defaultService = '';
    obj.currentPackageSelected = '';
    obj.currentLicencesSelected = '';
    obj.totalCost = 0;
    obj.isChangedDefaultState = false;
}

function clearSegmentsList() {
    const segmentItemsList = document.querySelectorAll("[data-segment-item]");
    segmentItemsList.forEach((segmentItem, index) => {
        if (segmentItem.classList.contains("swiper-slide-checked")) {
            segmentItem.classList.remove("swiper-slide-checked");
        }
    });

    $('#btnSegmentsNext').attr('disabled', 'disabled');
}

function animateCounter(element, endValue) {
    let startValue = 0;
    let startTime = null;
    const duration = 1500; // Total animation duration for all counters
    const increment = endValue / (60 * (duration / 1000)); // Calculate the step so that it depends on the final value

    const step = timestamp => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
        element.textContent = currentValue;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = endValue;
        }
    };

    window.requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
        const endValue = parseInt(counter.getAttribute('data-counter'), 10);
        animateCounter(counter, endValue);
    });
});

function openModalModule(slideId) {
    const packageContainerWrap = document.querySelector(`#${slideId} [data-package-container-wrap]`);
    const bgOpacityInner = document.getElementById('bgOpacityInner');
    const dropdownTabs = document.querySelectorAll(`#${slideId} [data-mobile-modal-open]`);


    dropdownTabs.forEach(dropdownTab => {
        dropdownTab.addEventListener('click', (event) => {

            if (event.isTrusted) {
                packageContainerWrap.classList.add('package-container-wrap-open');

                let screenWidth = $(window).width();
                if (screenWidth <= 1024) {
                    bgOpacityInner.classList.add('bg-opacity-inner-open');
                }
            }

        });
    });
}


document.addEventListener("click", () => {
    const packageModalCloseBtns = document.querySelectorAll("[data-package-modal-close]");
    const bgOpacityInner = document.getElementById("bgOpacityInner");
    const packageContainerWraps = document.querySelectorAll('[data-package-container-wrap]');


    packageModalCloseBtns.forEach(packageModalClose => {
        packageModalClose.addEventListener("click", () => {
            const openDDList=document.querySelectorAll(".drop-down-item-open")
            openDDList.forEach(openItem=>{
                openItem.querySelector(".dropdown-menu").style.maxHeight="0";
                openItem.classList.remove("drop-down-item-open");
            })

            packageContainerWraps.forEach(packageContainerWrap => {
                packageContainerWrap.classList.remove('package-container-wrap-open');
                packageContainerWrap.classList.remove('subscription-step-box-open');
            });

            bgOpacityInner.classList.remove('bg-opacity-inner-open');
        });
    });

});


document.addEventListener("DOMContentLoaded", () => {
    const subscriptionModalInfo = document.getElementById("subscriptionModalInfo");

    subscriptionModalInfo.addEventListener("click", () => {
        const packageContainerWrap = document.querySelector(`#slide5 .subscription-step-box`);
        const bgOpacityInner = document.getElementById('bgOpacityInner');

        packageContainerWrap.classList.add('subscription-step-box-open');
        bgOpacityInner.classList.add('bg-opacity-inner-open');
        showModulePanel("Research Package","", "currentBoxModules", );

    });
});


export {
    showModulePanel,
    findSegmentById,
    getServicesFromSelectedSegments,
    getAvailableServices,
    determineDefaultState,
    dropdownTogglePanel,
    calculateTotalCost,
    updateTotalCount,
    changePackageSelect,
    resetForm,
    clearSegmentsList,
    openModalModule
};
