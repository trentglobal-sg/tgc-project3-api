const forms = require ('forms')
const widgets = forms.widgets;
const fields = forms.fields;
const validators = forms.validators;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (brands, categories, genders, activities, blends, microns, fits) => {
    return forms.create({
        'product': fields.string({
            required: true,
            errorAfterField: true
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true
        }),
        'cost': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'brand_id': fields.string({
            label: 'Brand',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: brands
        }),
        'category_id': fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: categories
        }),
        'gender_id': fields.string({
            label: 'Gender',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: genders
        }),
        'activity_id': fields.string({
            label: 'Activity',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: activities
        }),
        'blend_id': fields.string({
            label: 'Blend',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: blends
        }),
        'micron_id': fields.string({
            label: 'Micron',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: microns
        }),
        'fit_id': fields.string({
            label: 'Fit',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: fits
        }),
        'created_date': fields.date({
            widget: widgets.hidden()
        }),
        'product_image_url': fields.string({
            widget: widgets.hidden()
        }),
        'product_thumbnail_url': fields.string({
            widget: widgets.hidden()
        })
    })
}



module.exports = {bootstrapField, createProductForm}